import { colors } from "@cliffy/ansi/colors";

async function checkCommandExists(command: string): Promise<boolean> {
	const process = new Deno.Command("which", {
		args: [command],
	}).spawn();

	const status = await process.status;
	return status.success;
}

async function determineUnixEditor(): Promise<
	{ command: string; args: string[] }
> {
	const priorityEditors = [
		{ command: "code", args: ["--wait"] },
		{ command: "nano", args: [] },
		{ command: "vim", args: [] },
		{ command: "vi", args: [] },
		{ command: "emacs", args: [] },
	];

	for (const editor of priorityEditors) {
		if (await checkCommandExists(editor.command)) {
			return editor;
		}
	}

	console.error(
		`Non of text editors we support is installed, please install one of these Editors`,
		priorityEditors.map((e) => colors.bgGreen.white(e.command)),
	);
	Deno.exit(1);
}

export async function multiLineInput(defaultContent?: string): Promise<string> {
	console.log(
		colors.bgGreen("A text editor has been opened. Enter your content there."),
	);

	const tempFile = await Deno.makeTempFile();
	await Deno.writeTextFile(
		tempFile,
		defaultContent ?? "",
	);

	const editor = Deno.build.os === "windows" ? { command: "notepad.exe", args: [] } : await determineUnixEditor();

	const command = new Deno.Command(editor.command, {
		args: [...editor.args, tempFile],
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	});

	const process = command.spawn();
	const status = await process.status;

	if (!status.success) {
		throw new Error("Editor exited with non-zero status code");
	}

	const content = await Deno.readTextFile(tempFile);

	try {
		await Deno.remove(tempFile);
	} catch (error) {
		if (!(error instanceof Deno.errors.NotFound)) {
			throw error;
		}
	}

	return content;
}
