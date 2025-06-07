import { Webdock } from "../webdock.ts";
import { expect } from "jsr:@std/expect";

const api = new Webdock(false);

Deno.test({
	name: "Events API - List and Structure Validation",
	fn: async (t) => {
		const res = await api.events.list({});

		await t.step("should return successful response", () => {
			expect(res.success).toBe(true);
		});

		if (!res.success) return;

		await t.step("should contain array of events with valid schema", () => {
			res.data.body.forEach((event) => {
				expect(event).toMatchObject({
					id: expect.any(Number),
					startTime: expect.any(String),
					callbackId: expect.anything(),
					serverSlug: expect.any(String),
					eventType: expect.any(String),
					action: expect.any(String),
					actionData: expect.any(String),
					status: expect.any(String),
				});

				/**
				 * TODO:
				 * message: true endTime: true,
				 */
			});
		});

		await t.step("should validate event structure and required fields", () => {
			res.data.body.forEach((event) => {
				expect(event).toMatchObject({
					id: expect.any(Number),
					startTime: expect.any(String),
					callbackId: expect.anything(),
					serverSlug: expect.any(String),
					eventType: expect.any(String),
					action: expect.any(String),
					actionData: expect.any(String),
					status: expect.any(String),
				});

				/**
				 * TODO:
				 * message: true endTime: true,
				 */
			});
		});

		await t.step("should include valid total count header", () => {
			const countHeader = res.data.headers["x-total-count"];
			const count = Number(countHeader);
			expect(count).toBeGreaterThanOrEqual(0);
		});
	},
});
