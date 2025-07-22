import { Select } from "@cliffy/prompt/select";
import { Webdock } from "../../../webdock/webdock.ts";
import { goToMainMenu } from "../../goto/main-menu.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { goToServerActionMenu } from "../../goto/server-actions-menu.ts";
import {
  addGoToMainMenuToOptions,
  isMainMenu,
} from "../../goto/options/go-to-main-menu-to-options.ts";

export async function reinstall(PARENT: () => void, slug: string) {
  const spinner = new Spinner();
  const client = new Webdock(false);
  const images = await client.images.list();
  if (!images.success) {
    console.error(images.error);
    Deno.exit(1);
  }
  const image = await Select.prompt({
    message: "Choose operating system:",
    options: images.data.body
      .map((img) => ({
        name: `${img.name} (${img.slug})`,
        value: img.slug,
      }))
      .concat(addGoToMainMenuToOptions),
  });

  if (isMainMenu(image)) return PARENT();
  const confirm = await Select.prompt({
    message: "Confirm server creation:",
    options: [
      { name: "✅ Yes, Reinstall server", value: true },
      { name: "❌ Cancel creation", value: false },
    ],
  });

  if (!confirm) {
    console.log("🚫 Server reinstalation cancelled");
    return PARENT();
  }

  spinner.message = "🚀 Launching your server...";
  spinner.start();

  const response = await client.servers.reinstall({
    imageSlug: image,
    serverSlug: slug,
  });
  spinner.stop();
  if (!response.success) {
    console.error("❌ Reinsallation failed:", response.error);
    return PARENT();
  }

  const event = await client.waitForEvent(
    response.data.headers["x-callback-id"]
  );
  if (!event) return goToMainMenu();

  console.log("\n✅ Server ready!");
  console.log(`🔗 Access URL: https://webdock.io/en/dash/server/${slug}`);
  console.log("🎉 Happy hosting!");
  goToServerActionMenu(slug);
}
