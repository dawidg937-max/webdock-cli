import { Confirm } from "@cliffy/prompt/confirm";
import { Webdock } from "../../../../webdock/webdock.ts";
import { goToServerActionMenu } from "../../../goto/server-actions-menu.ts";

export async function deleteServerScript(
	PARENT: () => void,
	serverSlug: string,
	scriptId: number,
) {
	const client = new Webdock(false);
	console.log("🚀 Starting script deletion process...\n");

	const confirmed = await Confirm.prompt({
		message: `Are you sure you want to delete script #${scriptId}?`,
		default: false,
	});

	if (!confirmed) {
		console.log("\n❌ Deletion cancelled by user");
		return PARENT();
	}

	console.log("\n🔄 Deleting script from Webdock...");

	const response = await client.scripts.deleteScriptFromServer({
		scriptId: scriptId,
		serverSlug: serverSlug,
	});

	if (!response.success) {
		console.error(
			"\n❌ Script deletion failed:",
			response.error || "Unknown error",
		);
		Deno.exit(1);
	}

	console.log("\n🎉 Script deleted successfully!");
	console.log(`🗑️ Deleted script ID: ${scriptId}`);
	goToServerActionMenu(serverSlug);
}
