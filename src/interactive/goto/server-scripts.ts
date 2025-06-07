import { serverScriptsMenu } from "../menus/servers/scripts/main-menu.ts";

export const goToServerScriptsMenu = (slug: string) => serverScriptsMenu(() => {}, slug);
