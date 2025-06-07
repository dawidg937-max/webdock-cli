import { serverActionsInterface } from "../menus/servers/actions-menu.ts";

export function goToServerActionMenu(slug: string) {
	serverActionsInterface(() => {}, slug);
}
