import { Confirm } from "@cliffy/prompt/confirm";
import { Webdock } from "../../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { colors } from "@cliffy/ansi/colors";
import { goToServerActionMenu } from "../../../goto/server-actions-menu.ts";
import { goToMainMenu } from "../../../goto/main-menu.ts";

export async function deleteShellUser(
	PARENT: () => void,
	{ slug, userId }: { slug: string; userId: number },
) {
	const _COME_BACK_HERE = () => deleteShellUser(PARENT, { slug, userId });
	const spinner = new Spinner();
	const client = new Webdock(false);

	const confirm = await Confirm.prompt({
		message: "⚠️  PERMANENTLY delete this shell user?",
		default: false,
		hint: "This cannot be undone!",
	});

	if (!confirm) {
		console.log("🚫 Deletion cancelled");
		return PARENT();
	}

	spinner.message = "🗑️  Deleting user account...";
	spinner.start();

	const response = await client.shellUsers.delete({
		serverSlug: slug,
		userId: userId,
	});
	spinner.stop();

	if (!response.success) {
		switch (response.code) {
			case 404:
				console.error("❌ User or server not found");
				break;
			case 403:
				console.error("❌ Permission denied");
				break;
			case 409:
				console.error("❌ User is currently active");
				break;
			default:
				console.error("❌ Deletion failed:", response.error);
		}
		return goToMainMenu();
	}

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);

	if (!event) return goToMainMenu();

	console.log("\n✅ User deleted successfully!");
	console.log(
		"🌐 Verify on dashboard:",
		colors.underline(`https://webdock.io/en/dash/shellusers/${slug}`),
	);
	goToServerActionMenu(slug);
}
