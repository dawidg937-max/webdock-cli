import { colors } from "@cliffy/ansi/colors";
import { Confirm, Input } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { goToMainMenu } from "../../goto/main-menu.ts";

export async function createSnapshot(PARENT: () => void, slug: string) {
	const spinner = new Spinner();
	const client = new Webdock(false);

	const name = await Input.prompt({
		message: "📸 Enter snapshot name:",
		validate: (input) => input.length > 2 || "Name must be at least 3 characters",
	});

	const confirm = await Confirm.prompt({
		message: `Create snapshot '${name}' for server ${slug}?`,
		default: false,
	});

	if (!confirm) {
		console.log("🚫 Snapshot creation cancelled");
		return PARENT();
	}

	spinner.message = "📡 Creating server snapshot...";
	spinner.start();
	const response = await client.snapshots.create({
		name: name,
		serverSlug: slug,
	});
	spinner.stop();

	if (!response.success) {
		switch (response.code) {
			case 404:
				console.error("❌ Server not found");
				break;
			case 409:
				console.error("❌ Snapshot already exists");
				break;
			case 400:
				console.error("❌ Invalid request:", response.error);
				break;
			default:
				console.error("❌ Creation failed:", response.error);
		}
		return goToMainMenu();
	}

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);
	if (!event) return goToMainMenu();

	console.log(colors.green("\n✅ Snapshot created successfully!"));
	console.log("📛 Name:", colors.cyan(name));
	console.log("🆔 ID:", response.data.body.id);
	console.log(
		"🔗 Manage snapshots:",
		colors.underline(`https://webdock.io/en/dash/managesnapshots/${slug}`),
	);
	PARENT();
}
