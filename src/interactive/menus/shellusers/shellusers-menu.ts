import { Webdock } from "../../../webdock/webdock.ts";
import { deleteShellUser } from "../../functions/servers/shellusers/delete.ts";
import { updateShellUserKeys } from "../../functions/servers/shellusers/edit.ts";
import { Select } from "@cliffy/prompt";
import { colors } from "@cliffy/ansi/colors";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { Spinner } from "@std/cli/unstable-spinner";

export async function listShellUsers(PARENT: () => void, slug: string) {
	const _COME_BACK_HERE = () => listShellUsers(PARENT, slug);
	const spinner = new Spinner();
	const client = new Webdock(false);

	spinner.message = "🔍 Loading shell users...";
	spinner.start();
	const response = await client.shellUsers.list({ serverSlug: slug });
	spinner.stop();
	if (!response.success) {
		switch (response.code) {
			case 404:
				console.error("❌ Server not found");
				break;
			case 403:
				console.error("❌ Permission denied");
				break;
			default:
				console.error("❌ Failed to fetch users:", response.error);
		}
		return PARENT();
	}

	if (!response.data.body || response.data.body.length === 0) {
		console.log("ℹ️  No shell users found for this server");
		return PARENT();
	}

	console.log(colors.bgBlue.white(` SHELL USERS (${slug.toUpperCase()}) `));

	const selectedUser = await Select.prompt({
		message: "Select a user:",
		options: response.data.body.map((user) => ({
			name: [
				`${colors.yellow(user.username.padEnd(15))}`,
				`${user.group}`,
				`${user.shell.padEnd(10)}`,
				`${new Date(user.created).toLocaleDateString()}`,
			].join(" | "),
			value: user.id,
			// @ts-expect-error::
		})).concat(addGoToMainMenuToOptions),
	});
	if (isMainMenu(selectedUser)) return PARENT();

	const action = await Select.prompt({
		message: "Select a action:",
		options: [
			{
				name: "Delete Shell User",
				value: "delete",
			},
			{
				name: "Edit Shell User",
				value: "edit",
			},
		].concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(action)) return PARENT();

	if (action == "delete") {
		await deleteShellUser(_COME_BACK_HERE, { slug, userId: selectedUser });
	}
	if (action == "edit") {
		await updateShellUserKeys(_COME_BACK_HERE, {
			serverSlug: slug,
			shellUserId: selectedUser,
		});
	}
}
