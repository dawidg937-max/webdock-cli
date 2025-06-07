import { Input, Select } from "@cliffy/prompt";

import { z } from "npm:zod";

import { Webdock } from "../../../webdock/webdock.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { goToMainMenu } from "../../goto/main-menu.ts";
const client = new Webdock(false);
import { Spinner } from "@std/cli/unstable-spinner";
import { colors } from "@cliffy/ansi/colors";
import { EventsTypesList } from "../../../cli/event-types.ts";

export async function createHook(PARENT: () => void) {
	const _COME_BACK_HERE = () => createHook(PARENT);
	const spinner = new Spinner();

	const finalCallbackUrl = await Input.prompt({
		message: "Enter callback URL:",
		validate: (v) => {
			const URLSchema = z.string().url();
			const parsed = URLSchema.safeParse(v);
			if (!parsed.success) {
				return "Url is not valid";
			}
			return true;
		},
	});

	const finalCallbackId = await Input.prompt({
		message: "Enter callback ID:",
	});

	const _finalEventType = await Select.prompt({
		message: "Select event type:",
		options: EventsTypesList.map((value) => ({
			name: value ?? "",
			value: value ?? "",
			// @ts-expect-error:: don't delete this
		})).concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(_finalEventType)) return PARENT();

	const confirm = await Select.prompt({
		message: "Confirm hook creation:",
		options: [
			{ name: "✅ Create hook", value: true },
			{ name: "❌ Cancel", value: false },
		],
	});

	if (!confirm) {
		console.log("🚫 Hook creation cancelled");
		return PARENT();
	}

	spinner.message = "⚡ Creating event hook...";

	const response = await client.hooks.create({
		callbackUrl: finalCallbackUrl,
		callbackId: parseInt(finalCallbackId, 10),

		eventType: _finalEventType,
	});

	if (!response.success) {
		spinner.stop();
		console.error("❌ Creation failed:", response.error);
		return goToMainMenu();
	}

	console.log(colors.bgGreen("Hook created successfully!"));

	PARENT();
}
