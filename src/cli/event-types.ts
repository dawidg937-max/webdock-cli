import { EnumType } from "@cliffy/command";

export type EventTypeType =
	| "provision"
	| "restore-server"
	| "change-profile"
	| "set-state"
	| "delete"
	| "backup"
	| "set-hostnames"
	| "update-webroot"
	| "setup-ssl"
	| "install-wordpress"
	| "manage-wordpress"
	| "manage-shelluser"
	| "manage-keys"
	| "toggle-passwordauth"
	| "manage-mysql"
	| "manage-dbuser"
	| "manage-ftpuser"
	| "set-php-settings"
	| "cronjob"
	| "pull-file"
	| "push-file"
	| "delete-file"
	| "execute-file";

export const EventsTypesList = [
	"provision",
	"restore-server",
	"change-profile",
	"set-state",
	"delete",
	"backup",
	"set-hostnames",
	"update-webroot",
	"setup-ssl",
	"install-wordpress",
	"manage-wordpress",
	"manage-shelluser",
	"manage-keys",
	"toggle-passwordauth",
	"manage-mysql",
	"manage-dbuser",
	"manage-ftpuser",
	"set-php-settings",
	"cronjob",
	"pull-file",
	"push-file",
	"delete-file",
	"execute-file",
] as const;

export const eventTypeEnum = new EnumType(EventsTypesList);
