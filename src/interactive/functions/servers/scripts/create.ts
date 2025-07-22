import { Confirm } from "@cliffy/prompt/confirm";
import { Input } from "@cliffy/prompt/input";
import { Select } from "@cliffy/prompt/select";
import { Webdock } from "../../../../webdock/webdock.ts";
import { Table } from "@cliffy/table";
import { Spinner } from "@std/cli/unstable-spinner";

export async function createServerScript(PARENT: () => void, slug: string) {
  const client = new Webdock(false);
  console.log("🚀 Starting server script deployment workflow");

  const spinner = new Spinner();
  spinner.message = "Loading available scripts...";
  spinner.start();
  const response = await client.scripts.list();
  spinner.stop();

  if (!response.success) {
    console.error(
      "\n❌ Failed to load scripts:",
      response.error || "Unknown error"
    );
    return PARENT();
  }

  if (response.data.body.length === 0) {
    console.log("\n📭 No scripts available. Create one first!");
    return PARENT();
  }

  const scriptId = await Select.prompt({
    message: "Select a script to deploy:",
    options: response.data.body.map((script) => ({
      value: script.id,
      name: `📜 ${script.name} (ID: ${script.id})`,
    })),
  });

  const selectedScript = response.data.body.find((s) => s.id === scriptId)!;

  const path = await Input.prompt({
    message: "Enter deployment path:",
    validate: (val) => (val.length != 0 ? true : `path is required`),
    info: true,
  });

  // Execution options
  let executable = await Confirm.prompt({
    message: "🔐 Make script executable?",
    hint: "Required for immediate execution",
    default: false,
  });

  let executeImmediately = false;
  if (executable) {
    executeImmediately = await Confirm.prompt({
      message: "⚠️  Execute immediately after deployment?",
      hint: "This will run the script on the server",
      default: false,
    });
  } else if (
    await Confirm.prompt({
      message: "Enable executable flag to allow immediate execution?",
      default: false,
    })
  ) {
    executable = true;
    executeImmediately = true;
  }

  // Confirmation dialog
  console.log("\n📋 Deployment Summary:");
  new Table()
    .border()
    .header(["Setting", "Value"])
    .body([
      ["Server", slug],
      ["Script", `${selectedScript.name} (ID: ${scriptId})`],
      ["Path", path],
      ["Executable", executable ? "✅ Yes" : "❌ No"],
      ["Immediate Execution", executeImmediately ? "⚠️  Yes" : "❌ No"],
    ])
    .render();

  const confirmed = await Confirm.prompt({
    message: "Confirm deployment?",
    default: false,
  });

  if (!confirmed) {
    console.log("\n🚫 Deployment cancelled");
    return PARENT();
  }

  spinner.message = "🚚 Deploying script...";
  spinner.start();

  const create = await client.scripts.createOnServer({
    scriptId,
    path,
    makeScriptExecutable: executable,
    executeImmediately,
    serverSlug: slug,
  });
  spinner.stop();

  if (!create.success) {
    console.error("\n❌ Deployment failed:", create.error || "Unknown error");
    if (create.code === 404) {
      console.error(
        "💡 Verify:",
        `- Server slug '${slug}' exists\n` + `- Script ID ${scriptId} is valid`
      );
    }
    return PARENT();
  }

  console.log("\n🎉 Successfully deployed script!");
  console.log(`📌 Path: ${create.data.body.path}`);
  console.log(`🕒 Created at: ${new Date().toLocaleString()}`);

  if (executeImmediately) {
    console.log("\n⚡ Script execution started - check server logs for output");
  }
  PARENT();
}
