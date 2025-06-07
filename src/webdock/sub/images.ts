import { Webdock } from "../webdock.ts";

export type ServerImage = {
	slug: string;

	name: string;

	webServer: "Apache" | "Nginx" | null;

	phpVersion: string | null;
};

export type ListImageTypeResponse = {
	body: ServerImage[];
};

export class ImagesClass {
	private parent: Webdock;
	constructor(parent: Webdock) {
		this.parent = parent;
	}

	async list(token = "") {
		return await this.parent.req<ListImageTypeResponse>({
			token: token,
			endpoint: "/images",
			headers: [],
			method: "GET",
		});
	}
}
