import { serverActionsInterface } from "../menus/servers/actions-menu.ts";

export const goToServerScreen = (serverSlug: string) => serverActionsInterface(() => {}, serverSlug);
