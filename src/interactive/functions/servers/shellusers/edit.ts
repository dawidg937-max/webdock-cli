import { Checkbox, Confirm } from "@cliffy/prompt";
import { Webdock } from "../../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { colors } from "@cliffy/ansi/colors";
import { goToServerActionMenu } from "../../../goto/server-actions-menu.ts";
import { goToMainMenu } from "../../../goto/main-menu.ts";

export async function updateShellUserKeys(
	PARENT: () => void,
	{ serverSlug, shellUserId }: {
		serverSlug: string;
		shellUserId: number;
	},
) {
	const __COME_BACK_HERE = () => updateShellUserKeys(PARENT, { serverSlug, shellUserId });
	const spinner = new Spinner();
	const client = new Webdock(false);

	spinner.message = "🔑 Loading available keys...";
	spinner.start();
	const keys = await client.sshkeys.list();
	spinner.stop();

	if (!keys.success) {
		switch (keys.code) {
			case 404:
				console.error("❌ Resource not found");
				break;
			case 429:
				console.error("❌ Too many requests - try again later");
				break;
			default:
				console.error("❌ Failed to fetch keys:", keys.error);
		}
		return goToMainMenu();
	}

	let selected_keys;
	if (keys.success && keys.data.body.length > 0) {
		selected_keys = await Checkbox.prompt({
			message: "select keys! (Hit Enter twice to skip)",
			options: keys.data.body.map((e) => {
				return {
					value: e.id,
					name: `${e.name} (${e.id})`,
				};
			}),
		});
	} else {
		console.log("No ssh keys were found, create one first");
		return PARENT();
	}

	const confirm = await Confirm.prompt({
		message: "Update SSH keys for this user?",
		default: false,
	});

	if (!confirm) {
		console.log("🚫 Update cancelled");
		return PARENT();
	}

	spinner.message = "🔄 Updating SSH keys...";

	const response = await client.shellUsers.edit({
		id: shellUserId,
		keys: (selected_keys ?? []),
		slug: serverSlug,
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
			default:
				console.error("❌ Key update failed:", response.error);
		}
		return goToMainMenu();
	}

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);

	if (!event) return goToMainMenu();
	console.log(colors.green("\n✅ SSH keys updated successfully!"));

	goToServerActionMenu(serverSlug);
}
