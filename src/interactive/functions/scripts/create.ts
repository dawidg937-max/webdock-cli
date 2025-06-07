import { Confirm, Input } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { multiLineInput } from "../../utils/multiline.ts";
import { colors } from "@cliffy/ansi/colors";

export async function createScript(PARENT: () => void) {
	console.log("🚀 Starting script creation process...\n");
	const client = new Webdock(false);

	const name = await Input.prompt({
		message: "What name would you like to give your script?",
		validate: (val) => val.length >= 5 || "Script name must be at least 5 characters",
	});

	const filename = await Input.prompt({
		message: "What filename should we use to save the script?",
		validate: (val) => val.length >= 5 || "Filename must be at least 5 characters",
	});

	const content = await multiLineInput();
	if (!content) {
		console.log(
			`❌${colors.bgRed(`Empty content detected. Canceling the operation.`)}`,
		);
		return PARENT();
	}

	const confirmed = await Confirm.prompt({
		message: `Are you sure you want to create script ?`,
		default: false,
	});

	if (!confirmed) {
		console.log("\n❌ Creating cancelled by user");
		return PARENT();
	}

	console.log("\n🔄 Submitting script to Webdock API...");

	const response = await client.scripts.create(
		{ name, filename, content },
	);

	if (!response.success) {
		console.error(
			"\n❌ Script creation failed:",
			response.error || "Unknown error",
		);
		return PARENT();
	}

	console.log("\n🎉 Script created successfully!");
	console.log(`🔑 Script ID: ${response.data.body.id}`);
	PARENT();
}
