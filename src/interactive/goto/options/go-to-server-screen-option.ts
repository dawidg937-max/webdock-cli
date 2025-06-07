export const addGoToServerScreenOptions = (_serverSlug: string) => {
	return {
		name: `🚪  Go Back`,
		value: `GO_BACK`,
	};
};

export function isReturnToServer(choice: string) {
	return choice === "GO_BACK";
}
