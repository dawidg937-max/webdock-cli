import { Spinner } from "@std/cli/unstable-spinner";
import { Webdock } from "../../../webdock/webdock.ts";
import { Select } from "@cliffy/prompt/select";
import { goToMainMenu } from "../../goto/main-menu.ts";

export async function archive(PARENT: () => void, slug: string) {
	const spinner = new Spinner();
	const client = new Webdock(false);
	const confirm = await Select.prompt({
		message: "Confirm Server Archiving:",
		options: [
			{ name: "✅ Yes, archive server", value: true },
			{ name: "❌ Cancel", value: false },
		],
	});

	if (!confirm) {
		console.log("🚫 Server Archiving cancelled");
		return PARENT();
	}

	spinner.message = "⏳ Archiving server...";
	spinner.start();

	const response = await client.servers.archive({
		serverSlug: slug,
	});
	spinner.stop();

	if (!response.success) {
		console.error("❌ Archiving failed:", response.error);
		return goToMainMenu();
	}

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);

	if (!event) return goToMainMenu();
	console.log("\n✅ Server Archived successfully!");
	goToMainMenu();
}
