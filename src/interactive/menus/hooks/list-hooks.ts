import { Confirm, Select } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import formatHookName from "../../utils/format-hook-name.ts";
import { colors } from "@cliffy/ansi/colors";
import { goToMainMenu } from "../../goto/main-menu.ts";

export async function manageWebhooks(PARENT: () => void) {
	const client = new Webdock(false);
	console.log(colors.bold.brightBlue("Fetching webhooks..."));

	// Get webhooks with loading indicator
	const hooks = await client.hooks.list();
	if (!hooks.success) {
		console.error(colors.red("× Failed to fetch webhooks:"), hooks.error);
		return goToMainMenu();
	}

	if (hooks.data.body.length === 0) {
		console.log(colors.yellow("! No webhooks found"));
		return PARENT();
	}

	// Display webhook selection
	const selectedHook = await Select.prompt({
		message: "Select a webhook:",
		options: hooks.data.body.map((hook) => ({
			value: hook.id,
			name: formatHookName(hook),
			// @ts-expect-error:: addGoToMainMenuToOptions will always be handled directly after the choice
		})).concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(String(selectedHook))) return PARENT();

	// Action selection
	const action = await Select.prompt({
		message: "Select action:",
		options: [{
			value: "delete",
			name: `${colors.red("Delete")} webhook`,
		}].concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(action)) return PARENT();

	if (action === "delete") {
		const confirmDelete = await Confirm.prompt(
			colors.red("⚠ Are you sure you want to delete this webhook?") +
				" This action cannot be undone.",
		);

		if (!confirmDelete) {
			console.log(colors.yellow("! Deletion cancelled"));
			return PARENT();
		}

		console.log(colors.blue("Deleting webhook..."));
		const deleteResult = await client.hooks.deleteById({ id: selectedHook });

		if (!deleteResult.success) {
			console.error(
				colors.red("× Failed to delete webhook:"),
				deleteResult.error,
			);
			return PARENT();
		}

		console.log(colors.green("✓ Webhook deleted successfully"));
		console.log(colors.dim(`Deleted webhook ID: ${selectedHook}`));
	} else {
		// for the future
	}
	PARENT();
}
