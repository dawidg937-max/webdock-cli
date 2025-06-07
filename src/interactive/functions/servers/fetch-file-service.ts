import { Input } from "@cliffy/prompt";

import { Webdock } from "../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { goToMainMenu } from "../../goto/main-menu.ts";
import { sanitizePath } from "../../../utils/sanitize-path.ts";

export async function fetchFile(PARENT: () => void, slug: string) {
	const client = new Webdock(false);

	const spinner = new Spinner();

	const path = await Input.prompt({
		message: "📁 Enter file path to retrieve:",
		validate: (val) => val.startsWith("/") ? true : "Path should be absolute",
	});

	const sanitizedPath = await sanitizePath(path);
	if (!sanitizedPath) return;

	spinner.message = "🔍 Searching for file...";
	spinner.start();

	const response = await client.servers.fetchFile({
		path: sanitizedPath,
		slug: slug,
	});
	spinner.stop();

	if (!response.success) {
		switch (response.code) {
			case 400:
				console.error("❌ Invalid request:", response.error);
				break;
			case 404:
				console.error("❌ Server or file not found");
				break;
			default:
				console.error("❌ File retrieval failed:", response.error);
		}
		return goToMainMenu();
	}

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);
	if (!event) return goToMainMenu();
	console.log("\n✅ File successfully retrieved!");
	PARENT();
}
