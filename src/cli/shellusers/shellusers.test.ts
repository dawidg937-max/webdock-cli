import { expect } from "jsr:@std/expect/expect";
import { join } from "jsr:@std/path@^1.0.8/join";
import { extractIdsFromStdOut, extractSlugsFromStdOut } from "../../test_utils.ts";
const decoder = new TextDecoder();

let tempServerSlug = "";
let shellUsersId = 0;
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

		await t.step("[CLI] Create Shelluser", async () => {
			const createShellUser = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"shellusers",
					"create",
					tempServerSlug,
					"test_username",
					"test_password",
					"--wait",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await createShellUser.output();
			const stdout = decoder.decode(output.stdout);

			expect(output.success).toBe(true);

			const ids = extractIdsFromStdOut(stdout);

			console.log("ids", ids);

			shellUsersId = ids[0] ?? "";
		});

		await t.step("[CLI] Delete Shelluser", async () => {
			const deleteShellUser = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"shellusers",
					"delete",
					tempServerSlug,
					String(shellUsersId),
					"--wait",
					"-f",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await deleteShellUser.output();

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
