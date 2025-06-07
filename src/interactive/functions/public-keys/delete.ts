import { Confirm } from "@cliffy/prompt";
import { colors } from "@cliffy/ansi/colors";
import { Webdock } from "../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { goToMainMenu } from "../../goto/main-menu.ts";

export async function deleteSSHKey(PARENT: () => void, id: number) {
	const spinner = new Spinner();
	const client = new Webdock(false);

	const confirm = await Confirm.prompt({
		message: "⚠️  PERMANENTLY delete this SSH key?",
		default: false,
	});

	if (!confirm) {
		console.log("🚫 Deletion cancelled");
		return PARENT();
	}

	spinner.message = "🗑️  Deleting SSH key...";
	spinner.start();

	const response = await client.sshkeys.delete({
		id: id,
	});
	spinner.stop();

	if (!response.success) {
		switch (response.code) {
			case 404:
				console.error("❌ Key not found");
				break;
			case 403:
				console.error("❌ Permission denied");
				break;
			default:
				console.error("❌ Deletion failed:", response.error);
		}
		return goToMainMenu();
	}

	console.log("✅ Successfully deleted SSH key:", colors.green(id.toString()));
	console.log(
		"🌐 Manage keys:",
		colors.underline("https://webdock.io/en/dash/profile"),
	);
	goToMainMenu();
}
