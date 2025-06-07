import { expect } from "jsr:@std/expect/expect";
import * as path from "jsr:@std/path";

Deno.test({
	name: "Account Info CLI",
	fn: async (t) => {
		const scriptPath = path.join(Deno.cwd(), "src", "main.ts");
		const decoder = new TextDecoder();

		const accountInfo = new Deno.Command("deno", {
			args: [
				"run",
				"--allow-env",
				"--allow-read",
				"--allow-write",
				"--allow-net",
				"--allow-run",
				scriptPath,
				"account",
				"info",
			],
			stdout: "piped",
			stderr: "piped",
		});

		const output = await accountInfo.output();

		const stdout = decoder.decode(output.stdout);

		expect(output.success).toBe(true);
		await t.step("To Contain ID", () => {
			expect(stdout).toContain("ID");
		});
		await t.step("To Contain Name", () => {
			expect(stdout).toContain("Name");
		});
		await t.step("To Contain Team Leader", () => {
			expect(stdout).toContain("Team Leader");
		});
		await t.step("To Contain Balance", () => {
			expect(stdout).toContain("Balance");
		});
	},
});
