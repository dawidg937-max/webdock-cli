import { Webdock } from "../webdock.ts";

export type ShellUser = {
	id: number;
	username: string;
	group: string;
	shell: string;
	created: string;
	updated: string;
	publicKeys: number[];
};

export type CreateShellUserResponseType = {
	body: ShellUserDTO;
	headers: {
		"x-callback-id": string;
	};
};

export type DeleteUserShellResponseType = {
	body: ShellUser;
	headers: {
		"x-callback-id": string;
	};
};

export type ListShellUsersResponseType = {
	body: ShellUser[];
};

export type PublicKeyDTO = {
	id: number;
	name: string;
	key: string;
	created: string;
};

export type ShellUserDTO = {
	id: number;
	username: string;
	group: string;
	shell: string;
	publicKeys: PublicKeyDTO[];
	created: string;
};
export type ListShellUserDTO = {
	id: number;
	username: string;
	group: string;
	shell: string;
	publicKeys: PublicKeyDTO[];
	created: string;
};
export type ShellUserCreationResponse = {
	headers: {
		"x-callback-id": string;
	};

	body: ShellUserDTO;
};

export type CreateWebSSHTokenResponseType = {
	body: {
		token: string;
	};
};

export class ShellUsersClass {
	private parent: Webdock;
	constructor(parent: Webdock) {
		this.parent = parent;
	}

	create({ serverSlug, username, password, group, shell, publicKeys, token }: {
		serverSlug: string;
		username: string;
		password: string;
		group?: string;
		shell?: string;
		publicKeys?: number[];
		token?: string;
	}) {
		return this.parent.req<CreateShellUserResponseType>({
			token,
			endpoint: `servers/${serverSlug}/shellUsers`,
			method: "POST",
			body: {
				username,
				password,
				group,
				shell,
				publicKeys: publicKeys ?? [],
			},
			headers: ["x-callback-id"],
		});
	}

	delete({ serverSlug, userId, token }: {
		serverSlug: string;
		userId: number;
		token?: string;
	}) {
		return this.parent.req<DeleteUserShellResponseType>({
			token,
			endpoint: `servers/${serverSlug}/shellUsers/${userId}`,
			method: "DELETE",
			headers: ["x-callback-id"],
		});
	}

	list({ serverSlug, token }: {
		serverSlug: string;
		token?: string;
	}) {
		return this.parent.req<ListShellUsersResponseType>({
			token,
			endpoint: `/servers/${serverSlug}/shellUsers`,
			method: "GET",
		});
	}
	edit(
		{ slug, id, token, keys }: {
			slug: string;
			id: number;
			token?: string;
			keys: number[];
		},
	) {
		return this.parent.req<ShellUserCreationResponse>({
			endpoint: `servers/${slug}/shellUsers/${id}`,
			method: "PATCH",
			body: {
				publicKeys: keys,
			},
			headers: ["x-callback-id"],
			token: token,
		});
	}
	websshToken(
		{ serverSlug, username, token }: {
			serverSlug: string;
			username: string;
			token?: string;
		},
	) {
		return this.parent.req<CreateWebSSHTokenResponseType>(
			{
				endpoint: `servers/${serverSlug}/shellUsers/WebsshToken`,
				method: "POST",
				token: token,
				body: {
					username,
				},
			},
		);
	}
}
