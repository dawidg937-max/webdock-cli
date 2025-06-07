import { Spinner } from "@std/cli/unstable-spinner";
import { Webdock } from "../../../webdock/webdock.ts";
import { goToServerActionMenu } from "../../goto/server-actions-menu.ts";
import { Confirm } from "@cliffy/prompt";
import { goToMainMenu } from "../../goto/main-menu.ts";

export async function startServerAction(PARENT: () => void, slug: string) {
	const spinner = new Spinner();
	const client = new Webdock(false);
	const confirm = await Confirm.prompt({
		message: "⚠️  WARNING:are you sure you want to start this server?",
		default: false,
	});

	if (!confirm) {
		console.log("🚫 Server start cancelled");
		return PARENT();
	}

	spinner.message = "🚀 Initializing server startup...";
	spinner.start();
	const response = await client.servers.start({
		serverSlug: slug,
	});
	spinner.stop();

	if (!response.success) {
		console.error("❌ Startup command failed:", response.error);
		return goToMainMenu();
	}

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);
	if (!event) return goToMainMenu();

	console.log("✅ Server is fully operational and ready!");
	goToServerActionMenu(slug);
}
