export const addGoToMainMenuToOptions = {
	name: `🚪  Go Back`,
	value: "MAIN_MENU",
};

export function isMainMenu(choice: string) {
	return choice == "MAIN_MENU";
}
