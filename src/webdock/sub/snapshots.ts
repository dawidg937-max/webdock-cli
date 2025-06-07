import { Webdock } from "../webdock.ts";

export type Snapshot = {
	id: number;
	name: string;
	date: string; // ISO 8601 datetime string
	type: "daily" | "weekly" | "monthly";
	virtualization: "container" | "kvm";
	completed: boolean;
	deletable: boolean;
};

export type SnapshotsCreateResponseType = {
	body: Snapshot;
	headers: {
		"x-callback-id": string;
	};
};

export type DeleteSnapShotResponseType = {
	body: Snapshot;
	headers: {
		"x-callback-id": string;
	};
};

export type ListSnapshotResponseType = {
	body: Snapshot[];
};

export type RestoreSnapShotType = {
	body: Snapshot;
	headers: {
		"x-callback-id": string;
	};
};

export class SnapshotsClass {
	private parent: Webdock;

	constructor(parent: Webdock) {
		this.parent = parent;
	}

	create({
		serverSlug,
		name,
		token,
	}: {
		serverSlug: string;
		name: string;
		token?: string;
	}) {
		return this.parent.req<SnapshotsCreateResponseType>({
			token,
			endpoint: `/servers/${serverSlug}/snapshots`,
			method: "POST",
			body: {
				name,
			},
			headers: ["x-callback-id"],
		});
	}

	list({
		serverSlug,
		token,
	}: {
		serverSlug: string;
		token?: string;
	}) {
		return this.parent.req<ListSnapshotResponseType>({
			token,
			endpoint: `/servers/${serverSlug}/snapshots`,
			method: "GET",
		});
	}

	delete({
		serverSlug,
		snapshotId,
		token,
	}: {
		serverSlug: string;
		snapshotId: number;
		token?: string;
	}) {
		return this.parent.req<DeleteSnapShotResponseType>({
			token,
			endpoint: `/servers/${serverSlug}/snapshots/${snapshotId}`,
			method: "DELETE",
			headers: ["x-callback-id"],
		});
	}

	restore({
		serverSlug,
		snapshotId,
		token,
	}: {
		serverSlug: string;
		snapshotId: number;
		token?: string;
	}) {
		return this.parent.req<RestoreSnapShotType>({
			token,
			endpoint: `/servers/${serverSlug}/actions/restore`,
			method: "POST",
			headers: ["x-callback-id"],
			body: {
				snapshotId: snapshotId,
			},
		});
	}
}
