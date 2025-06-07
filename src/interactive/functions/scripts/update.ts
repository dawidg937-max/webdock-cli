import { Confirm, Input } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { Table } from "@cliffy/table";
import { multiLineInput } from "../../utils/multiline.ts";
import { colors } from "@cliffy/ansi/colors";

export async function updateScript(PARENT: () => void, id: number) {
	console.log("🚀 Starting script update process...\n");
	const client = new Webdock(false);
	const script = await client.scripts.getById({ scriptId: id });
	if (!script.success) {
		return PARENT();
	}

	const name = await Input.prompt({
		message: "Enter new script name:",
		validate: (val) => val.length >= 5 || "Name must be at least 5 characters",
		default: script.data.body.name,
	});

	const filename = await Input.prompt({
		message: "Enter new filename:",
		validate: (val) => val.length >= 5 || "Filename must be at least 5 characters",
		default: script.data.body.filename,
	});

	const content = await multiLineInput(script.data.body.content);
	if (!content) {
		console.log(
			`❌${colors.bgRed(`Empty content detected. Canceling the operation.`)}`,
		);
		return PARENT();
	}
	console.log("\n📝 Update Summary:");
	new Table()
		.border()
		.header(["Field", "Value"])
		.body([
			["ID", script.data.body.id],
			["Name", name],
			["Filename", filename],
		])
		.render();

	const confirmed = await Confirm.prompt({
		message: "Confirm these changes?",
		default: false,
	});

	if (!confirmed) {
		console.log("\n❌ Update cancelled");
		return PARENT();
	}

	console.log("\n🔄 Submitting update to Webdock...");

	const response = await client.scripts.update({
		id,
		name,
		filename,
		content,
	});

	if (!response.success) {
		console.error("\n❌ Update failed:", response.error || "Unknown error");
		if (response.code === 404) {
			console.error("💡 Hint: Check if the script ID exists");
		}
		if (response.code === 400) {
			console.error("💡 Hint: Validate your input format");
		}
		return PARENT();
	}

	console.log("\n🎉 Script updated successfully!");

	new Table()
		.border()
		.header(["Field", "Updated Value"])
		.body([
			["ID", response.data.body.id],
			["Name", response.data.body.name],
			["Filename", response.data.body.filename],
			["Last Updated", new Date().toLocaleString()],
			["Content Preview", response.data.body.content.slice(0, 25) + "..."],
		])
		.render();

	PARENT();
}
