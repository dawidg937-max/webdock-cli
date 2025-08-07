import { expect } from "jsr:@std/expect/expect";
import * as path from "jsr:@std/path";
import { extractIdsFromStdOut } from "../../test_utils.ts";

Deno.test({
	name: "Hooks Create CLI",

	fn: async (t) => {
		const scriptPath = path.join(Deno.cwd(), "src", "main.ts");
		console.log("scriptPath", scriptPath);

		const decoder = new TextDecoder();
		let createdHookId: number | null = null;

		// Test valid input
		await t.step("Valid Input", async () => {
			const createHook = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					scriptPath,
					"hooks",
					"create",
					`https://addel.vip?q=${Date.now()}`,
					"--event-type",
					"provision",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await createHook.output();
			const stdout = decoder.decode(output.stdout);

			expect(output.success).toBe(true);
			expect(stdout).toContain("ID");
			expect(stdout).toContain("Callback URL");
			expect(stdout).toContain("Filters");

			const ids = extractIdsFromStdOut(stdout);
			if (ids && ids.length > 0) {
				createdHookId = ids[0];
				console.log(`Created hook ID: ${createdHookId}`);
			}
		});

		// Test invalid URL
		await t.step("Invalid URL", async () => {
			const createHook = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					scriptPath,
					"hooks",
					"create",
					"not-a-url",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await createHook.output();
			expect(output.success).toBe(false);
		});

		// Test invalid event type
		await t.step("Invalid Event Type", async () => {
			const createHook = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					scriptPath,
					"hooks",
					"create",
					"https://example.com/callback",
					"--event-type",
					"invalid-event-type",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await createHook.output();
			expect(output.success).toBe(false);
		});

		// Test missing required URL
		await t.step("Missing Required URL", async () => {
			const createHook = new Deno.Command("deno", {
				args: [
					"run",
					"--allow-env",
					"--allow-read",
					"--allow-write",
					"--allow-net",
					scriptPath,
					"hooks",
					"create",
				],
				stdout: "piped",
				stderr: "piped",
			});

			const output = await createHook.output();
			expect(output.success).toBe(false);
		});

		if (createdHookId) {
			await t.step("Cleanup: Delete Created Hook", async () => {
				const deleteHook = new Deno.Command("deno", {
					args: [
						"run",
						"--allow-env",
						"--allow-read",
						"--allow-write",
						"--allow-net",
						scriptPath,
						"hooks",
						"delete",
						String(createdHookId),
						"-f",
					],
					stdout: "piped",
					stderr: "piped",
				});

				const output = await deleteHook.output();

				console.log(decoder.decode(output.stdout));

				expect(output.success).toBe(true);
			});
		}
	},
});
