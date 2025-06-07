export const addGoToServerScriptsOptions = (serverSlug: string) => {
	return {
		name: `🚪  Go Back`,
		value: `WEBDOCK_SERVER_SCRIPTS_${serverSlug}`,
	};
};

export function isReturnToServerScripts(choice: string) {
	const choice_string = JSON.stringify(choice);
	if (choice_string.startsWith("WEBDOCK_SERVER_SCRIPTS_")) {
		return choice_string.split("WEBDOCK_SERVER_SCRIPTS_")[1];
	}
	return null;
}
