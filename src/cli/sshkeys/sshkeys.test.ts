import { expect } from "jsr:@std/expect/expect";
import { Webdock } from "../../webdock/webdock.ts";

const client = new Webdock(false);

let key_id = 0;

Deno.test({
	name: "Test sshkeys",
	fn: async (it) => {
		await it.step("Create Key", async (it) => {
			const key = await client.sshkeys.create({
				name: "test_key",
				publicKey: "some_key",
			});
			await it.step("create SSH Key", () => {
				expect(key.success).toBe(true);
			});
			if (!key.success) return;
			await it.step("create SSH Key valid response", () => {
				expect(key.data.body).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String),
					key: expect.any(String),
					created: expect.any(String),
				});
			});
			key_id = key.data.body.id;
		});

		await it.step("Delete Key", async (it) => {
			const key = await client.sshkeys.delete({ id: key_id });
			await it.step("Delete SSH Key", () => {
				expect(key.success).toBe(true);
			});
		});
	},
});
