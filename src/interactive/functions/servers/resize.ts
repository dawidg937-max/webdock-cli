import { Confirm, Select } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import {
  addGoToServerScreenOptions,
  isReturnToServer,
} from "../../goto/options/go-to-server-screen-option.ts";
import { goToMainMenu } from "../../goto/main-menu.ts";
import { colors } from "@cliffy/ansi/colors";

export async function resizeServerAction(PARENT: () => void, slug: string) {
  const client = new Webdock(false);

  const spinner = new Spinner();

  const serverInfo = await client.servers.getBySlug({ serverSlang: slug });

  if (!serverInfo.success) {
    console.error("❌ Failed to fetch server details:", serverInfo.error);
    return PARENT();
  }

  console.log("\nCurrent Server Configuration:");
  console.log(`🖥️  Name          : ${serverInfo.data.body.name}`);
  console.log(`📦 Current Profile: ${serverInfo.data.body.profile}`);
  console.log("------------------------------");
  const profiles = await client.profiles.list({ locationId: "dk" });
  if (!profiles.success) {
    console.error(profiles.error);
    Deno.exit(1);
  }

  // Profile selection with comparison
  const longestName = Math.max(...profiles.data.body.map((p) => p.name.length));
  const currentProfile = profiles.data.body.find((e) => {
    console.log(
      e.slug,
      serverInfo.data.body.profile,
      e.slug == serverInfo.data.body.profile
    );

    return e.slug == serverInfo.data.body.profile;
  });

  const filteredProfiles = profiles.data.body.filter((e) => {
    console.log(e.disk, currentProfile?.disk);

    return (
      e.disk > (currentProfile?.disk ?? 0) &&
      e.slug != serverInfo.data.body.profile &&
      ((e.slug.includes("epyc") &&
        serverInfo.data.body.profile?.includes("epyc")) ||
        (!e.slug.includes("epyc") &&
          !serverInfo.data.body.profile?.includes("epyc")))
    );
  });
  if (filteredProfiles.length == 0) {
    console.log(
      colors.bgGreen(
        "The server is at maximum specs capacity, no room for upgrades"
      )
    );
    return PARENT();
  }
  const profile = await Select.prompt({
    message: "Select new server profile:",
    options: filteredProfiles
      .map((p) => ({
        name: `${p.name.padEnd(longestName + 2)} | ${p.cpu.cores}C/${
          p.cpu.threads
        }vCPU | ${(p.ram / 1024).toFixed(1)}GB RAM | ${(p.disk / 1024).toFixed(
          1
        )}GB Disk`,
        value: p.slug,
      }))
      .concat(addGoToServerScreenOptions(slug)),
  });

  const GO_BACK = isReturnToServer(profile);

  if (GO_BACK) return PARENT();

  const confirm = await Confirm.prompt({
    message: "⚠️  WARNING: Resizing requires server restart! Continue?",
    default: false,
  });

  if (!confirm) {
    console.log("🚫 Server reboot cancelled");
    return PARENT();
  }

  spinner.message = "🔧 Resizing server resources...";
  spinner.start();

  const response = await client.servers.resize({
    profileSlug: profile,
    serverSlug: slug,
  });
  spinner.stop();
  if (!response.success) {
    switch (response.code) {
      case 404:
        console.error("❌ Server not found");
        break;
      case 409:
        console.error("❌ Server must be stopped first");
        break;
      default:
        console.error("❌ Resize failed:", response.error);
    }
    return goToMainMenu();
  }

  const event = await client.waitForEvent(
    response.data.headers["x-callback-id"]
  );
  if (!event) return goToMainMenu();

  console.log("\n✅ Server resize complete!");
  console.log("📊 New Profile:", profile);
  console.log("🔗 Dashboard: https://webdock.io/en/dash/server/" + slug);
  return PARENT();
}
