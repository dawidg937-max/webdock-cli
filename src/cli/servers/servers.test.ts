import { expect } from "jsr:@std/expect/expect";
import { join } from "jsr:@std/path@^1.0.8/join";
import { extractSlugsFromStdOut } from "../../test_utils.ts";
const decoder = new TextDecoder();

let tempServerSlug = "";
Deno.test({
	name: "Test Servers CLI",
	fn: async (t) => {
		await t.step("[CLI] Create Temp Server", async () => {
			const creatServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"servers",
					"create",
					`temp-${Date.now()}`,
					"dk",
					"webdockbit-2024",
					"-i",
					"krellide:webdock-noble-lamp",
					"--slug",
					`temp-${Date.now()}`,
					"--wait",
				],

				stdout: "piped",
				stderr: "piped",
			});

			const output = await creatServer.output();
			const stdout = decoder.decode(output.stdout);

			expect(output.success).toBe(true);
			expect(stdout).toContain("Slug");
			expect(stdout).toContain("Name");
			expect(stdout).toContain("Location");
			expect(stdout).toContain("IP");

			const slugs = extractSlugsFromStdOut(stdout);

			tempServerSlug = slugs[0] ?? "";
		});

		await t.step("[CLI] GET Temp Server", async () => {
			const getServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"servers",
					"get",
					tempServerSlug,
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await getServer.output();

			expect(output.success).toBe(true);

			const stdout = decoder.decode(output.stdout);

			expect(output.success).toBe(true);
			expect(stdout).toContain("Slug");
			expect(stdout).toContain("Name");
			expect(stdout).toContain("Location");
			expect(stdout).toContain("Status");
			expect(stdout).toContain("IP");
		});

		await t.step("[CLI] Reboot Temp Server", async () => {
			const rebootServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"servers",
					"reboot",
					tempServerSlug,
					"--wait",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await rebootServer.output();

			expect(output.success).toBe(true);
		});

		await t.step("[CLI] stop Temp Server", async () => {
			const stopServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"servers",
					"stop",
					tempServerSlug,
					"--wait",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await stopServer.output();

			expect(output.success).toBe(true);
		});

		await t.step("[CLI] resize Temp Server", async () => {
			const resizeServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"servers",
					"resize",
					tempServerSlug,
					"webdockpremium-2024",
					"--wait",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await resizeServer.output();

			expect(output.success).toBe(true);
		});

		await t.step("[CLI] resinstall Temp Server", async () => {
			const resizeServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"servers",
					"reinstall",
					tempServerSlug,
					"krellide:webdock-noble-lamp",
					"--wait",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await resizeServer.output();

			expect(output.success).toBe(true);
		});

		await t.step("[CLI] update Temp Server", async () => {
			const updateServer = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"servers",
					"update",
					tempServerSlug,
					"new_name",
					"new_description",
					"notes",
					"25-9-9",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await updateServer.output();

			expect(output.success).toBe(true);
		});

		await t.step("[CLI] delete Temp Server", async () => {
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

			expect(output.success).toBe(true);
		});
	},
});
