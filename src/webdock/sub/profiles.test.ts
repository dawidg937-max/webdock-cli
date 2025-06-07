import { expect } from "jsr:@std/expect/expect";
import { Webdock } from "../webdock.ts";

const client = new Webdock(false);

Deno.test("Server Profiles API - List and Validation", async (t) => {
	await t.step("list() - Retrieve server profiles for location", async (t) => {
		const response = await client.profiles.list({ locationId: "dk" });

		await t.step("should return successful response", () => {
			expect(response.success).toBe(true);
		});

		if (!response.success) return;

		const profiles = response.data.body;

		await t.step("should return array of server profiles", () => {
			expect(profiles).toBeInstanceOf(Array);
			expect(profiles.length).toBeGreaterThan(0);
		});

		await t.step("should validate profile schema and data integrity", () => {
			profiles.forEach((profile) => {
				expect(profile).toMatchObject({
					slug: expect.any(String),
					name: expect.any(String),
					ram: expect.any(Number),
					disk: expect.any(Number),
					cpu: {
						cores: expect.any(Number),
						threads: expect.any(Number),
					},
					price: {
						amount: expect.any(Number),
						currency: expect.any(String),
					},
				});

				expect(profile.slug).toMatch(/^[\w-]+$/);
				expect(profile.name.length).toBeGreaterThan(0);
				expect(profile.ram).toBeGreaterThan(0);
				expect(profile.disk).toBeGreaterThan(0);
				expect(profile.price.amount).toBeGreaterThan(0);
				expect(profile.price.currency).toMatch(/^[A-Z]{3}$/);
			});
		});
	});
});
