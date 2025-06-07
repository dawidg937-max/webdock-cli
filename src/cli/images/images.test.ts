import { expect } from "jsr:@std/expect/expect";
import * as path from "jsr:@std/path";

Deno.test({
	name: "Images List CLI",
	fn: async (t) => {
		const scriptPath = path.join(Deno.cwd(), "src", "main.ts");
		const decoder = new TextDecoder();

		const imagesList = new Deno.Command("deno", {
			args: [
				"run",
				"--allow-env",
				"--allow-read",
				"--allow-write",
				"--allow-net",
				scriptPath,
				"images",
				"list",
			],
			stdout: "piped",
			stderr: "piped",
		});

		const output = await imagesList.output();
		const stdout = decoder.decode(output.stdout);

		expect(output.success).toBe(true);
		await t.step("To Contain Slug", () => {
			expect(stdout).toContain("Slug");
		});
		await t.step("To Contain Name", () => {
			expect(stdout).toContain("Name");
		});
		await t.step("To Contain Type", () => {
			expect(stdout).toContain("Type");
		});
		await t.step("To Contain PHP Version", () => {
			expect(stdout).toContain("phpVersion");
		});
	},
});
