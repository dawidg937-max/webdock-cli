import { colors } from "@cliffy/ansi/colors";
import { Webdock } from "../../../webdock/webdock.ts";
import {
  addGoToMainMenuToOptions,
  isMainMenu,
} from "../../goto/options/go-to-main-menu-to-options.ts";
import { ScriptActions } from "./actions-menu.ts";
import { Select } from "@cliffy/prompt";

export async function ListscriptsMenu(PARENT: () => void) {
  const _COME_BACK_HERE = () => ListscriptsMenu(PARENT);
  const client = new Webdock(false);
  const response = await client.scripts.list();
  if (!response.success) {
    console.error(response.error);
    return PARENT();
  }
  if (!response.success || response.data.body.length == 0) {
    console.log(colors.bgRed("No Scripts were found!"));
    return PARENT();
  }

  const maxLength = Math.max(...response.data.body.map((e) => e.name.length));
  const choice = await Select.prompt({
    message: "Select a script:",
    options: response.data.body
      .map((script) => {
        return {
          name: `(${script.id}) - ${script.name.padEnd(maxLength)}`,
          value: script.id,
        };
      })
      // @ts-expect-error:
      .concat(addGoToMainMenuToOptions),
  }); // @ts-expect-error:

  if (isMainMenu(choice)) return PARENT();

  await ScriptActions(_COME_BACK_HERE, choice);
}
