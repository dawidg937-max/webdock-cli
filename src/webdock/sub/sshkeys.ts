import { Webdock } from "../webdock.ts";

export type SSHKeys = {
	fingerprint: string;
	id: number;
	name: string;
	key: string;
	created: string;
};

export type CreateSSHKeysResponseType = {
	body: SSHKeys;
};

export type ListSSHKeysResponseType = {
	body: SSHKeys[];
};

export class SshKeysClass {
	private parent: Webdock;
	constructor(parent: Webdock) {
		this.parent = parent;
	}

	create({ name, publicKey, token }: {
		name: string;
		publicKey: string;
		token?: string;
	}) {
		return this.parent.req<CreateSSHKeysResponseType>({
			token,
			endpoint: "/account/publicKeys",
			method: "POST",
			body: {
				name,
				publicKey,
			},
		});
	}

	delete({ id, token }: {
		id: number;
		token?: string;
	}) {
		return this.parent.req<CreateSSHKeysResponseType>({
			token,
			endpoint: `/account/publicKeys/${id}`,
			method: "DELETE",
		});
	}

	list({ token }: { token?: string } = {}) {
		return this.parent.req<ListSSHKeysResponseType>({
			token,
			endpoint: "/account/publicKeys",
			method: "GET",
		});
	}
}
