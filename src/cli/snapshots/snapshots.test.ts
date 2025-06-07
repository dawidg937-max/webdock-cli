import { expect } from "jsr:@std/expect/expect";
import { join } from "jsr:@std/path@^1.0.8/join";
import { extractIdsFromStdOut, extractSlugsFromStdOut } from "../../test_utils.ts";
const decoder = new TextDecoder();

let tempServerSlug = "";
let test_snapshotId = 0;
Deno.test({
	name: "Test Servers CLI",
	fn: async (t) => {
		await t.step("[CLI] Create Temp Server", async () => {
			const tempServer = new Deno.Command("deno", {
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

			const output = await tempServer.output();
			const stdout = decoder.decode(output.stdout);

			expect(output.success).toBe(true);

			const slugs = extractSlugsFromStdOut(stdout);

			tempServerSlug = slugs[0] ?? "";
		});

		await t.step("[CLI] Create a snapshot", async () => {
			const test_snapshot = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"snapshots",
					"create",
					tempServerSlug,
					"snapshot_test_name",
					"--wait",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await test_snapshot.output();
			const stdout = decoder.decode(output.stdout);

			expect(output.success).toBe(true);

			const ids = extractIdsFromStdOut(stdout);

			test_snapshotId = ids[0] ?? "";
		});

		await t.step("[CLI] delete a snapshot", async () => {
			const delete_test_snapshot = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					join(Deno.cwd(), "src", "main.ts"),
					"snapshots",
					"create",
					tempServerSlug,
					String(test_snapshotId),
					"--wait",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await delete_test_snapshot.output();

			expect(output.success).toBe(true);
		});
	},
});
