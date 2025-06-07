import { Confirm } from "@cliffy/prompt/confirm";
import { Webdock } from "../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { goToMainMenu } from "../../goto/main-menu.ts";

export async function deleteServer(PARENT: () => void, slug: string) {
	const client = new Webdock(false);
	const spinner = new Spinner();

	const confirm = await Confirm.prompt(
		"⚠️ Are you SURE you want to PERMANENTLY DELETE this server? This cannot be undone!",
	);
	if (!confirm) {
		console.log("🚫 Server deletion cancelled");
		return PARENT();
	}

	spinner.message = "🗑️  Initiating server deletion...";
	spinner.start();

	const response = await client.servers.delete({ serverSlug: slug });
	spinner.stop();

	if (!response.success) {
		if (response.code === 404) {
			console.error("❌ Error: Server not found (404)");
		} else console.error(`❌ Deletion failed: ${response.error}`);
		return goToMainMenu();
	}
	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);
	if (!event) return goToMainMenu();

	console.log("✅ Server successfully deleted!");
	goToMainMenu();
}
