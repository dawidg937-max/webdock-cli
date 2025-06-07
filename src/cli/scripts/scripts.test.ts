import { expect } from "jsr:@std/expect/expect";
import { join } from "jsr:@std/path@^1.0.8/join";
import { extractIdsFromStdOut, extractSlugsFromStdOut } from "../../test_utils.ts";
const decoder = new TextDecoder();

let tempServerSlug = "";
let tempScriptId = 0;
let tempScriptIdOnServer = 0;
Deno.test({
	name: "Test Scripts CLI",
	fn: async (t) => {
		await t.step("[CLI] Create Temp Server", async (it) => {
			const createServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"servers",
					"create",
					`server-${Date.now()}`,
					"dk",
					"webdockepyc-premium",
					"-i",
					"krellide:webdock-noble-lamp",
					"--slug",
					`temp-${Date.now()}`,
					"--wait",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await createServer.output();
			const stdout = decoder.decode(output.stdout);
			console.log(stdout);

			await it.step("Check command succeeded", () => {
				expect(output.success).toBe(true);
			});

			await it.step("Check stdout contains Slug", () => {
				expect(stdout).toContain("Slug");
			});

			await it.step("Check stdout contains Name", () => {
				expect(stdout).toContain("Name");
			});

			await it.step("Check stdout contains Location", () => {
				expect(stdout).toContain("Location");
			});

			await it.step("Check stdout contains IP", () => {
				expect(stdout).toContain("IP");
			});

			const slugs = extractSlugsFromStdOut(stdout);
			tempServerSlug = slugs[0] ?? "";
		});

		await t.step("[CLI] Create script", async (it) => {
			const createScript = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"scripts",
					"create",
					"script_name",
					"/home/admin/script_file_name.sh",
					"echo hi;",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await createScript.output();
			const stdout = decoder.decode(output.stdout);

			await it.step("Check command succeeded", () => {
				expect(output.success).toBe(true);
			});

			await it.step("Check stdout contains ID", () => {
				expect(stdout).toContain("ID");
			});

			await it.step("Check stdout contains Name", () => {
				expect(stdout).toContain("Name");
			});

			await it.step("Check stdout contains Description", () => {
				expect(stdout).toContain("Description");
			});

			await it.step("Check stdout contains Filename", () => {
				expect(stdout).toContain("Filename");
			});

			await it.step("Check stdout contains Content", () => {
				expect(stdout).toContain("Content");
			});
			const ids = extractIdsFromStdOut(stdout);
			tempScriptId = ids[0] ?? 0;
		});

		await t.step("[CLI] Create script on server", async (it) => {
			const createScriptOnServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"scripts",
					"server-create",
					tempServerSlug,
					String(tempScriptId),
					"/home/admin/myscript.sh",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await createScriptOnServer.output();
			const stdout = decoder.decode(output.stdout);

			if (!output.success) {
				console.log("stdout", stdout);
				Deno.exit(0);
			}

			await it.step("Check command succeeded", () => {
				expect(output.success).toBe(true);
			});

			await it.step("Check stdout contains ID", () => {
				expect(stdout).toContain("ID");
			});

			await it.step("Check stdout contains Name", () => {
				expect(stdout).toContain("Name");
			});

			await it.step("Check stdout contains Path", () => {
				expect(stdout).toContain("Path");
			});

			await it.step("Check stdout contains Last Run", () => {
				expect(stdout).toContain("Last Run");
			});

			await it.step("Check stdout contains Last Run Callback ID", () => {
				expect(stdout).toContain("Last Run Callback ID");
			});

			const ids = extractIdsFromStdOut(stdout);
			tempScriptIdOnServer = ids[0] ?? 0;
		});

		await t.step("[CLI] execute script on server", async (it) => {
			const executeScriptOnServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"scripts",
					"server-execute",
					tempServerSlug,
					String(tempScriptIdOnServer),
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await executeScriptOnServer.output();

			await it.step("Check command succeeded", () => {
				expect(output.success).toBe(true);
			});
		});

		await t.step("[CLI] delete script from server", async (it) => {
			const deleteScriptFromServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"scripts",
					"server-delete",
					tempServerSlug,
					String(tempScriptIdOnServer),
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await deleteScriptFromServer.output();

			await it.step("Check command succeeded", () => {
				expect(output.success).toBe(true);
			});
		});

		await t.step("[CLI] delete script", async (it) => {
			const deleteScriptFromServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"scripts",
					"delete",
					String(tempScriptId),
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await deleteScriptFromServer.output();

			await it.step("Check command succeeded", () => {
				expect(output.success).toBe(true);
			});
		});

		await t.step("[CLI] delete Temp Server", async (it) => {
			const deleteServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"servers",
					"delete",
					tempServerSlug,
					"--wait",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await deleteServer.output();

			await it.step("Check command succeeded", () => {
				expect(output.success).toBe(true);
			});
		});
	},
});
