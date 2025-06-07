import { expect } from "jsr:@std/expect/expect";
import * as path from "jsr:@std/path";

Deno.test({
	name: "Events List CLI",
	fn: async (t) => {
		const scriptPath = path.join(Deno.cwd(), "src", "main.ts");
		const decoder = new TextDecoder();

		const eventsList = new Deno.Command("deno", {
			args: [
				"run",
				"--allow-env",
				"--allow-read",
				"--allow-write",
				"--allow-net",
				scriptPath,
				"events",
				"list",
			],
			stdout: "piped",
			stderr: "piped",
		});

		const output = await eventsList.output();
		const stdout = decoder.decode(output.stdout);

		expect(output.success).toBe(true);
		await t.step("To Contain ID", () => {
			expect(stdout).toContain("ID");
		});
		await t.step("To Contain Slug", () => {
			expect(stdout).toContain("Slug");
		});
		await t.step("To Contain Type", () => {
			expect(stdout).toContain("Type");
		});
		await t.step("To Contain StartTime", () => {
			expect(stdout).toContain("StartTime");
		});
		await t.step("To Contain End time", () => {
			expect(stdout).toContain("End time");
		});
		await t.step("To Contain Details", () => {
			expect(stdout).toContain("Details");
		});
	},
});
