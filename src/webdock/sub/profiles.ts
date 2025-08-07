import { Webdock } from "../webdock.ts";

export type CPU = {
	cores: number;
	threads: number;
};

export type Price = {
	amount: number;
	currency: string;
};

export type Profile = {
	slug: string;
	name: string;
	ram: number;
	disk: number;
	cpu: CPU;
	price: Price;
};

export type ListProfilesResponseType = {
	body: Profile[];
};



export class ProfilesClass {
	private parent: Webdock;
	constructor(parent: Webdock) {
		this.parent = parent;
	}

	async list({
		token = "",
		locationId = "dk",
		profileSlug = ""
	}) {

		const res = await this.parent.req<ListProfilesResponseType>({
			token: token,
			endpoint: `/profiles?locationId=${locationId}&profileSlug=${profileSlug}`,
			method: "GET",
		});

		// If the user is asking for one profile, return it as an array any way, not to break compatibility
		if (res.success == true && !(res.data.body instanceof Array)) res.data.body = [res.data.body]

		return res

	}
}


