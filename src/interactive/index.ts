import { Webdock } from "../webdock/webdock.ts";
import { createWebdockServer } from "./functions/servers/create-server.ts";
import { hooksMainMenu } from "./menus/hooks/main-menu.ts";
import { KeysInterface } from "./menus/publickeys/main-menu.ts";
import { listAllServers } from "./menus/servers/servers-menu.ts";
import { colors } from "@cliffy/ansi/colors";
import { Select } from "@cliffy/prompt";
import { ScriptMainMenu } from "./menus/scripts/main-menu.ts";
import { Table } from "@cliffy/table";
import { InteractiveModeLogHelp } from "./help.ts";

export async function main() {
  const _COME_BACK_HERE = () => main();
  const client = new Webdock(false);
  const response = await client.account.info();

  if (!response.success) {
    console.error(
      colors.red("✖ Invalid token: Please double-check your credentials")
    );
    Deno.exit(1);
  }
  console.log("\n");

  new Table()
    .body([
      ["Name", colors.yellow(response.data.body.userName)],
      ["Email", colors.cyan(response.data.body.userEmail)],
      [
        colors.bold(colors.magenta("Balance:")),
        colors.red(
          `${response.data.body.accountBalanceRaw} ${response.data.body.accountBalanceCurrency}`
        ),
      ],
    ])
    .border()
    .render();

  const command = await Select.prompt({
    message: "What would you like to do?",
    options: [
      {
        value: "CREATE_SERVER",
        name: "1. New Server",
      },
      {
        value: "LIST_SERVERS",
        name: "2. List and Manage Servers",
      },
      {
        value: "KEYS",
        name: "3. Manage SSH Keys",
      },
      {
        value: "HOOKS",
        name: "4. Manage WebHooks",
      },
      {
        value: "SCRIPTS",
        name: "5. Manage Scripts",
      },
      {
        name: "6. Show Help!",
        value: "HELP",
      },
      {
        name: "7. Exit",
        value: "EXIT",
      },
    ],
  });
  switch (command) {
    case "CREATE_SERVER":
      await createWebdockServer(_COME_BACK_HERE);

      break;
    case "LIST_SERVERS":
      await listAllServers(_COME_BACK_HERE);
      break;
    case "KEYS":
      await KeysInterface(_COME_BACK_HERE);
      break;
    case "HOOKS":
      await hooksMainMenu(_COME_BACK_HERE);
      break;
    case "SCRIPTS":
      await ScriptMainMenu(_COME_BACK_HERE);
      break;
    case "HELP":
      InteractiveModeLogHelp();
      break;
    case "EXIT":
      console.log("hasta la vista 👋");
      Deno.exit(0);
  }
}
