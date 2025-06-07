import { expect } from "jsr:@std/expect";
import { Webdock } from "../webdock.ts";

const client = new Webdock(false);
Deno.test({
	name: "Server Images API - List and Validation",
	fn: async (it) => {
		const response = await client.images.list();

		await it.step("should return successful response", () => {
			expect(response.success).toBe(true);
		});

		if (!response.success) return;

		await it.step("should validate image structure and required fields", () => {
			response.data.body.forEach((e) => {
				expect(e).toMatchObject({
					slug: expect.any(String),
					name: expect.any(String),
				});
			});
		});
	},
});
