import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { wrapSlug } from "../../../test_utils.ts";
import { Webdock } from "../../../webdock/webdock.ts";
import { stringify } from "csv-stringify/sync";

export const createCommand = new Command()
  .description("Create a Server!")
  .arguments("<name:string> <locationId:string> <profileSlug:profile>")
  .option("-t, --token <token:string>", "API token used for authentication")
  .option(
    "-i, --imageSlug <imageSlug:string>",
    "Slug identifier of the server image"
  )
  .option(
    "-v, --virtualization <virtualization:string>",
    "Type of virtualization to use"
  )
  .option("-s, --slug <slug:string>", "Unique Slug for the server")
  .option(
    "-a, --snapshotId <snapshotId:number>",
    "Optional snapshot ID to restore the server from"
  )
  .option(
    "--wait",
    "Wait until the server is fully up and running before exiting"
  )
  .option("--json", "Display the results in a json format instead of a Table", {
    conflicts: ["csv"],
  })
  .option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
  .action(async (options, name, locationId, profileSlug) => {
    const client = new Webdock(
      !options.csv && !options.json,
      !options.csv && !options.json
    );

    if (!options.imageSlug && !options.snapshotId) {
      createCommand.showHelp();
      console.error(
        colors.bold.underline.italic.bgRed(
          "Error: Please provide either '--imageSlug' or '--snapshotId'."
        )
      );

      Deno.exit(1);
    }

    const response = await client.servers.create({
      name: name,
      slug: options.slug,
      locationId: locationId,
      profileSlug: profileSlug as string,
      virtualization: options.virtualization,
      token: options.token,
      ...(options.imageSlug
        ? { imageSlug: options.imageSlug }
        : { snapshotId: options.snapshotId }),
    });

    if (!response.success) {
      console.error(response.error);
      Deno.exit(1);
    }

    if (options.wait) {
      await client.waitForEvent(response.data.headers["x-callback-id"]);
    }

    if (options.json) {
      console.log(JSON.stringify(response.data));
      return;
    }

    if (options.csv) {
      const keys = ["Slug", "Name", "Location", "IP"];
      const data = response.data.body as unknown as Record<string, unknown>;
      const body = keys.map((key) => {
        return data[key];
      });
      console.log(
        stringify([body], {
          columns: keys,
          header: true,
        }).trim()
      );

      return;
    }
    const data = response.data.body;
    new Table()
      .header(["Slug", "Name", "Location", "IP"])
      .body([
        [wrapSlug(data.slug), data.name, data.location, data.ipv4 ?? "N/A"],
      ])
      .align("center")
      .border()
      .render();
  });
