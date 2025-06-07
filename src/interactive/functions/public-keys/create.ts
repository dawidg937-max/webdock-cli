import { Confirm, Input } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { multiLineInput } from "../../utils/multiline.ts";
import { colors } from "@cliffy/ansi/colors";

export async function createSSHKey(PARENT: () => void) {
	const client = new Webdock(false);

	const name = await Input.prompt({
		message: "🔑 Enter key name:",
		validate: (input) => input.length > 2 || "Name must be at least 3 characters",
	});

	const publicKey = await multiLineInput();
	if (!publicKey) {
		console.log(
			`❌${colors.bgRed(`Empty key detected. Canceling the operation.`)}`,
		);
		return PARENT();
	}
	const confirm = await Confirm.prompt({
		message: "Create this SSH key?",
		default: false,
	});

	if (!confirm) {
		console.log("🚫 Key creation cancelled");
		return PARENT();
	}

	const spinner = new Spinner({ message: "🔨 Creating SSH key..." });
	const response = await client.sshkeys.create({ name, publicKey });
	spinner.stop();

	if (!response.success) {
		switch (response.code) {
			case 409:
				console.error("❌ Key name already exists");
				break;
			case 400:
				console.error("❌ Invalid key format");
				break;
			default:
				console.error("❌ Creation failed:", response.error);
		}
		return PARENT();
	}

	console.log("\n✅ SSH Key created successfully!");
	console.log("📛 Name:", response.data.body.name);
	console.log("🆔 ID:", response.data.body.id);
	PARENT();
}
