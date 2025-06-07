import { KeyActions } from "./actions-menu.ts";
import { Select } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { goToMainMenu } from "../../goto/main-menu.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { Spinner } from "@std/cli/unstable-spinner";

export async function listSSHKeys(PARENT: () => void) {
	const _COME_BACK_HERE = () => listSSHKeys(PARENT);
	const spinner = new Spinner();
	const client = new Webdock(false);

	spinner.message = "🔑 Loading SSH keys...";
	spinner.start();

	const response = await client.sshkeys.list();
	spinner.stop();

	if (!response.success) {
		switch (response.code) {
			case 404:
				console.error("❌ Resource not found");
				break;
			case 429:
				console.error("❌ Too many requests - try again later");
				break;
			default:
				console.error("❌ Failed to fetch keys:", response.error);
		}
		return PARENT();
	}

	if (response.data.body.length === 0) {
		console.log(
			"No SSH keys found!",
		);
		return PARENT();
	}

	const key = await Select.prompt({
		message: "Select key!",
		options: response.data.body.map((key) => {
			return {
				name: key.name,
				value: key.id,
			};
			// @ts-expect-error::
		}).concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(key)) return await goToMainMenu();

	await KeyActions(_COME_BACK_HERE, key);
}
