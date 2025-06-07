import { Webdock } from "../webdock.ts";

export type Location = {
	id: string;
	name: string;
	city: string;
	country: string;
	description: string;
	icon: string;
};

export type ListLocationsType = {
	body: Location[];
};

export class LocationClass {
	private parent: Webdock;
	constructor(parent: Webdock) {
		this.parent = parent;
	}

	async list(token = "") {
		return await this.parent.req<ListLocationsType>({
			token: token,
			endpoint: "/locations",
			method: "GET",
		});
	}
}
