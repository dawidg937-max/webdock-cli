import { expect } from "jsr:@std/expect/expect";
import { Webdock } from "../webdock.ts";

const client = new Webdock(false);

Deno.test({
	name: "Test Locations",
	fn: async (it) => {
		const locations = await client.location.list();
		await it.step("locations.list() to succeed", () => {
			expect(locations.success).toBe(true);
		});

		if (!locations.success) return;
		await it.step("locations.list() body to be array", () => {
			expect(locations.data.body).toBeInstanceOf(Array);
		});
	},
});
