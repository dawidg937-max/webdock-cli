import { images, profiles } from "../../../consts/consts.ts";
import { Input } from "@cliffy/prompt/input";
import { Select } from "@cliffy/prompt/select";
import { Webdock } from "../../../webdock/webdock.ts";
import { goToMainMenu } from "../../goto/main-menu.ts";
import { goToServerActionMenu } from "../../goto/server-actions-menu.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { colors } from "@cliffy/ansi/colors";
import { getServerOptions } from "../../menus/servers/servers-menu.ts";

export async function createWebdockServer(PARENT: () => void) {
	const spinner = new Spinner();

	const client = new Webdock(false);

	const serverName = await Input.prompt({
		message: "Enter server name:",
		validate: (input) => input.length > 3 || "Name must be at least 4 characters",
	});

	const longestName = Math.max(...profiles.map((p) => p.name.length));
	const profile = await Select.prompt({
		message: "Select server profile:",
		options: profiles.map((p) => ({
			name: `${p.name.padEnd(longestName + 2)} | ${p.cpu.cores}C/${p.cpu.threads}vCPU | ${(p.ram / 1024).toFixed(1)}GB RAM | ${(p.disk / 1024).toFixed(1)}GB SSD`,
			value: p.slug,
		})).concat(addGoToMainMenuToOptions),
	});
	if (isMainMenu(profile)) {
		return PARENT();
	}

	// New image type selection
	const imageType = await Select.prompt({
		message: "Do you want to create a new image or restore from a snapshot?",
		options: [
			{ name: "🆕 New Image", value: "new" },
			{ name: "📸 Restore Snapshot", value: "snapshot" },
		].concat(addGoToMainMenuToOptions),
	});
	if (isMainMenu(imageType)) {
		return PARENT();
	}

	let imageSlug: string = "";
	let snapshotChoice = 0;
	if (imageType === "new") {
		const image = await Select.prompt({
			message: "Choose operating system:",
			options: images.map((img) => ({
				name: `${img.name} (${img.slug})`,
				value: img.slug,
			})).concat(addGoToMainMenuToOptions),
		});
		if (isMainMenu(image)) {
			return PARENT();
		}
		imageSlug = image;
	} else {
		spinner.message = "🔍 Loading server list...";
		spinner.start();

		const response = await client.servers.list();
		spinner.stop();
		if (!response.success) {
			console.error("❌ Failed to load servers:", response.error);
			return goToMainMenu();
		}

		if (!response.success || response.data.body.length == 0) {
			console.log(colors.bgRed("No Server were found!"));
			return PARENT();
		}

		const options = getServerOptions(response.data.body);

		if (options.length === 0) {
			console.log("ℹ️  No servers found. Create one first!");
			return PARENT();
		}

		const serverChoice = await Select.prompt({
			message: "Select a server:",
			options: options.concat(addGoToMainMenuToOptions),
		});
		if (isMainMenu(serverChoice)) return PARENT();

		console.log("\n✅ Selected server:", serverChoice);
		spinner.message = "🔍 Loading server snapshots...";
		spinner.start();
		const snapshots = await client.snapshots.list({ serverSlug: serverChoice });
		spinner.stop();

		if (!snapshots.success) {
			console.error("❌ Failed to load server snapshots");
			return PARENT();
		}

		if (response.data.body.length == 0) {
			console.error("No snapshots were found for this server");
			return PARENT();
		}

		snapshotChoice = await Select.prompt({
			message: "Select a snapshot to manage:",
			options: snapshots.data.body.map((e) => ({
				value: e.id,
				name: e.name,
				// @ts-expect-error:
			})).concat(addGoToMainMenuToOptions),
		});
		if (isMainMenu(snapshotChoice)) return PARENT();
	}

	const confirm = await Select.prompt({
		message: "Confirm server creation:",
		options: [
			{ name: "✅ Yes, create server", value: true },
			{ name: "❌ Cancel creation", value: false },
		],
	});

	if (!confirm) {
		console.log("🚫 Server creation cancelled");
		return PARENT();
	}

	spinner.message = "Creating your server....";
	spinner.start();
	const response = await client.servers.create({
		name: serverName,
		locationId: "dk",
		profileSlug: profile,
		...(imageType === "new" ? { imageSlug } : { snapshotId: snapshotChoice }),
	});
	spinner.stop();

	if (!response.success) {
		console.error("❌ Creation failed:", response.error);
		return goToMainMenu();
	}

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);
	if (!event) return goToMainMenu();

	goToServerActionMenu(response.data.body.slug);
}
