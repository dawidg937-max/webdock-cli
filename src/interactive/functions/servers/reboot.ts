import { Spinner } from "@std/cli/unstable-spinner";
import { Webdock } from "../../../webdock/webdock.ts";
import { goToServerActionMenu } from "../../goto/server-actions-menu.ts";
import { Confirm } from "@cliffy/prompt/confirm";
import { goToMainMenu } from "../../goto/main-menu.ts";

export async function reboot(parent: () => void, slug: string) {
	const client = new Webdock(false);
	const spinner = new Spinner();
	const confirm = await Confirm.prompt(
		"⚠️ Are you SURE you want to reboot this server?!",
	);
	if (!confirm) {
		console.log("🚫 Server reboot cancelled");
		return parent();
	}
	spinner.message = "🔄 Initiating server reboot...";
	spinner.start();

	const response = await client.servers.reboot({ serverSlug: slug });

	if (!response.success) {
		spinner.stop();
		console.error("❌ Failed to initiate reboot:", response.error);
		return parent();
	}

	spinner.stop();

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);
	if (!event) return goToMainMenu();
	console.log("✅ Server reboot completed successfully!");
	goToServerActionMenu(slug);
}
