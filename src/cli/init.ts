import { Command } from "@cliffy/command";
import { client } from "../main.ts";

export const initCommand = new Command()
	.name("init")
	.description("Initialize the CLI with your API token")
	.option("-t, --token <token:string>", "API token for authentication", {
		required: true,
	})
	.action(async (options) => {
		await client.saveConfig({ token: options.token });
		const configPath = client.getConfigPath();
		console.log(`Configuration has been stored at: ${configPath}`);
	});
