import { Confirm } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { goToMainMenu } from "../../goto/main-menu.ts";

export async function deleteScript(PARENT: () => void, scriptId: number) {
	console.log("🚀 Starting script deletion process...\n");
	const client = new Webdock(false);

	const confirmed = await Confirm.prompt({
		message: `Are you sure you want to delete script #${scriptId}?`,
		default: false,
	});

	if (!confirmed) {
		console.log("\n❌ Deletion cancelled by user");
		return PARENT();
	}

	console.log("\n🔄 Deleting script from Webdock...");

	const response = await client.scripts.delete(
		{
			id: scriptId,
		},
	);

	if (!response.success) {
		console.error(
			"\n❌ Script deletion failed:",
			response.error || "Unknown error",
		);
		return PARENT();
	}

	console.log("\n🎉 Script deleted successfully!");
	console.log(`🗑️ Deleted script ID: ${scriptId}`);
	goToMainMenu();
}
