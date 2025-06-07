import { Webdock } from "../webdock.ts";

export type CreateScriptBodyType = {
	name: string;
	filename: string;
	content: string;
};

export type CreateScriptResponseType = {
	body: {
		id: number;
		name: string;
		description: string;
		filename: string;
		content: string;
	};
};

export type DeleteScriptServerReturnType = {
	body: Script;
	headers: {
		"x-callback-id": string;
	};
};

export type ExecuteScriptOnServerReturnType = {
	body: Script;
	headers: {
		"x-callback-id": string;
	};
};

export type GetScriptByIdTResponseType = {
	body: {
		id: number;
		name: string;
		description: string;
		filename: string;
		content: string;
	};
};
export interface ResponseHeaders {
	"x-callback-id": string;
}

/**
 * Response Schema (application/json)
 */
export interface Script {
	/** Script ID (int64) */
	id: number;
	/** Script name */
	name: string;
	/** Script path */
	path: string;
	/** Date/time of the last run */
	lastRun: string | null;
	/** Callback ID of the last script run */
	lastRunCallbackId: string | null;
	/** Creation date/time */
	created: string;
}

export type CreateScriptOnServerResponse = {
	headers: ResponseHeaders;
	body: Script;
};
export type ListScriptsOnServerResponseType = {
	body: {
		id: number;
		name: string;
		path: string;
		lastRun: Date | null;
		lastRunCallbackId: string;
		created: Date;
	}[];
};
export type ListScriptsResponse = {
	body: {
		id: number;
		name: string;
		description: string;
		filename: string;
		content: string;
	}[];
};

export class ScriptsClass {
	private parent: Webdock;
	constructor(parent: Webdock) {
		this.parent = parent;
	}

	create(
		{ content, filename, name, token }: {
			name: string;
			filename: string;
			content: string;
			token?: string;
		},
	) {
		return this.parent.req<CreateScriptResponseType>(
			{
				token: token,
				endpoint: "/account/scripts",
				method: "POST",
				body: {
					content,
					filename,
					name,
				},
			},
		);
	}
	createOnServer({
		scriptId,
		path,
		makeScriptExecutable,
		executeImmediately,
		serverSlug,
		token,
	}: {
		scriptId: number;
		path: string;
		makeScriptExecutable: boolean;
		executeImmediately: boolean;
		serverSlug: string;
		token?: string;
	}) {
		return this.parent.req<CreateScriptOnServerResponse>(
			{
				token: token,
				endpoint: `/servers/${serverSlug}/scripts`,
				method: "POST",
				body: {
					scriptId,
					path,
					makeScriptExecutable,
					executeImmediately,
				},
				headers: ["x-callback-id"],
			},
		);
	}
	delete({ token, id }: { token?: string; id: number }) {
		return this.parent.req<undefined>(
			{
				token: token,
				endpoint: `/account/scripts/${id}`,
				method: "DELETE",
			},
		);
	}
	deleteScriptFromServer(
		{ serverSlug, scriptId, token }: {
			serverSlug: string;
			scriptId: number;
			token?: string;
		},
	) {
		return this.parent.req<DeleteScriptServerReturnType>(
			{
				token: token,
				endpoint: `/servers/${serverSlug}/scripts/${scriptId}`,
				method: "DELETE",
			},
		);
	}
	executeOnServer(
		{ serverSlug, scriptID, token }: {
			serverSlug: string;
			scriptID: number;
			token?: string;
		},
	) {
		return this.parent.req<ExecuteScriptOnServerReturnType>(
			{
				token: token,
				endpoint: `/servers/${serverSlug}/scripts/${scriptID}/execute`,
				method: "POST",
				headers: ["x-callback-id"],
			},
		);
	}
	getById({ token, scriptId }: { token?: string; scriptId: number }) {
		return this.parent.req<GetScriptByIdTResponseType>(
			{
				token: token,
				endpoint: `/account/scripts/${scriptId}`,
				method: "GET",
			},
		);
	}
	list(token?: string) {
		return this.parent.req<ListScriptsResponse>({
			token: token,
			endpoint: "/account/scripts",
			method: "GET",
		});
	}
	listOnServer({ token, serverSlug }: {
		token?: string;
		serverSlug: string;
	}) {
		return this.parent.req<ListScriptsOnServerResponseType>(
			{
				token: token,
				endpoint: `/servers/${serverSlug}/scripts`,
				method: "GET",
			},
		);
	}
	update({
		id,
		name,
		filename,
		content,
		token,
	}: {
		id: number;
		name: string;
		filename: string;
		content: string;
		token?: string;
	}) {
		return this.parent.req<CreateScriptResponseType>(
			{
				token: token,
				endpoint: `/account/scripts/${id}`,
				method: "PATCH",
				body: {
					name,
					filename,
					content,
				},
			},
		);
	}
}
