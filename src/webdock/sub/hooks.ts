import { Webdock } from "../webdock.ts";

export type HookFilter = {
	type: string;
	value: string;
};

export type Hook = {
	id: number;
	callbackUrl: string;
	filters: HookFilter[];
};

export type GetHookByIdResponseType = {
	body: Hook;
};

export type ListHooksResponseType = {
	body: Hook[];
};

export class HooksClass {
	private parent: Webdock;
	constructor(parent: Webdock) {
		this.parent = parent;
	}
	async getById({
		token,
		id,
	}: {
		token?: string;
		id: number;
	}) {
		return await this.parent.req<GetHookByIdResponseType>(
			{
				endpoint: `hooks/${id}`,
				method: "GET",
				token: token,
			},
		);
	}
	async create({
		token,
		callbackUrl,
		eventType,
		callbackId,
	}: {
		token?: string;
		eventType?: string;

		callbackUrl: string;
		callbackId?: number;
	}) {
		return await this.parent.req<GetHookByIdResponseType>(
			{
				endpoint: `/hooks`,
				method: "POST",
				token: token,
				body: {
					callbackUrl: callbackUrl,
					callbackId: callbackId,
					eventType: eventType,
				},
			},
		);
	}
	async deleteById({ id, token }: { token?: string; id: number }) {
		return await this.parent.req(
			{
				endpoint: `hooks/${id}`,
				method: "DELETE",
				token: token,
			},
		);
	}
	async list(token?: string) {
		return await this.parent.req<ListHooksResponseType>(
			{
				token: token,
				endpoint: "/hooks",
				method: "GET",
			},
		);
	}
}
