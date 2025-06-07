import { Webdock } from "../webdock.ts";
import { expect } from "jsr:@std/expect";

const api = new Webdock(false);
Deno.test({
	name: "Account API - Validate Authentication Token",
	fn: async () => {
		const res = await api.account.info();
		expect(res.success).toBe(true);
	},
});
Deno.test({
	name: "Account API - Handle Invalid Token",
	fn: async () => {
		const res = await api.account.info("invalid_token");
		expect(res.success).toBe(false);
	},
});

Deno.test({
	name: "Account API - Verify Invalid Token Response",
	fn: async () => {
		const res = await api.account.info("invalid_token");
		expect(res.success).toBe(false);
		if (!res.success) {
			expect(res.code).toBe(401);
		}
	},
});

Deno.test({
	name: "Account API - Validate Account Information Structure",
	fn: async () => {
		const res = await api.account.info();
		expect(res.success).toBe(true);
		if (res.success) {
			expect(res.data).toMatchObject({
				body: {
					userId: expect.any(Number),
					companyName: expect.any(String),
					userName: expect.any(String),
					userAvatar: expect.any(String),
					userEmail: expect.any(String),
					isTeamMember: expect.any(Boolean),
					teamLeader: expect.any(String),
					accountBalance: expect.any(String),
					accountBalanceRaw: expect.any(String),
					accountBalanceCurrency: expect.any(String),
				},
				headers: {},
			});
		}
	},
});
