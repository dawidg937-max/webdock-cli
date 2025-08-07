import { AccountClass } from "./sub/account.ts";
import { EventsClass } from "./sub/events.ts";
import { HooksClass } from "./sub/hooks.ts";
import { ImagesClass } from "./sub/images.ts";
import { LocationClass } from "./sub/locations.ts";
import { ProfilesClass } from "./sub/profiles.ts";
import { ScriptsClass } from "./sub/scripts.ts";
import { ServersClass } from "./sub/servers.ts";
import { ShellUsersClass } from "./sub/shellusers.ts";
import { SshKeysClass } from "./sub/sshkeys.ts";
import { TokenClass } from "./sub/token.ts";
import { SnapshotsClass } from "./sub/snapshots.ts";
import { sleep } from "../utils/sleep-with-useless-fact.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { colors } from "@cliffy/ansi/colors";
import { uselessFacts } from "../utils/useless-facts.ts";
import axios, { type AxiosError } from "npm:axios";
interface Config {
  token?: string;
}

type WebdockApiRequestReturn<T> = Promise<
  | {
    success: true;
    data: T;
  }
  | {
    success: false;
    error: string;
    errorType: "network" | "server";
    code: number;
  }
>;
interface WebdockApiRequestOptions<T> {
  token?: string;
  endpoint: string;
  method: string;
  body?: unknown;
  headers?: string[];
  log?: boolean;
}

interface EventLog {
  id: number;
  startTime: string;
  endTime: string | null;
  callbackId: string;
  serverSlug: string;
  eventType: string;
  action: string;
  actionData: string;
  status: "waiting" | "working" | "finished" | "error";
  message: string;
}

type EventLogResponse = {
  body: EventLog[];
};

export function _getTimestamp(): string {
  const now = new Date();

  // Format: YYYY-MM-DD HH:MM:SS
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export class Webdock {
  private log: boolean = true;
  private fact: boolean = true;
  account: AccountClass;
  images: ImagesClass;
  profiles: ProfilesClass;
  events: EventsClass;
  hooks: HooksClass;
  location: LocationClass;
  scripts: ScriptsClass;
  servers: ServersClass;
  shellUsers: ShellUsersClass;
  sshkeys: SshKeysClass;
  snapshots: SnapshotsClass;
  token: TokenClass;

  constructor(log = false, fact = true) {
    this.log = log;
    this.fact = fact;
    this.token = new TokenClass(this);
    this.account = new AccountClass(this);
    this.images = new ImagesClass(this);
    this.profiles = new ProfilesClass(this);
    this.events = new EventsClass(this);
    this.hooks = new HooksClass(this);
    this.location = new LocationClass(this);
    this.scripts = new ScriptsClass(this);
    this.servers = new ServersClass(this);
    this.shellUsers = new ShellUsersClass(this);
    this.sshkeys = new SshKeysClass(this);
    this.snapshots = new SnapshotsClass(this);
  }

  getConfigPath(): string {
    const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || ".";
    const isWindows = Deno.build && Deno.build.os === "windows";
    const separator = isWindows ? "\\" : "/";
    return `${homeDir}${separator}.webdock-cli${separator}config.json`;
  }
  private getConfigDirPath(): string {
    const configPath = this.getConfigPath();
    const isWindows = Deno.build && Deno.build.os === "windows";
    const lastSeparatorIndex = isWindows
      ? configPath.lastIndexOf("\\")
      : configPath.lastIndexOf("/");

    return configPath.substring(0, lastSeparatorIndex);
  }
  private async pathExists(path: string): Promise<boolean> {
    try {
      await Deno.stat(path);
      return true;
    } catch {
      return false;
    }
  }
  private async loadConfig(): Promise<Config> {
    const configPath = this.getConfigPath();

    if (await this.pathExists(configPath)) {
      try {
        const configContent = await Deno.readTextFile(configPath);
        return JSON.parse(configContent);
      } catch (error) {
        console.error(
          "Error loading config:",
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    return {};
  }

  async saveConfig(config: Config): Promise<void> {
    const configPath = this.getConfigPath();
    const configDir = this.getConfigDirPath();

    try {
      await Deno.mkdir(configDir, { recursive: true });
      await Deno.writeTextFile(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error(
        `Error saving config: ${error instanceof Error ? error.message : String(error)
        }`
      );
      Deno.exit(1);
    }
  }

  private async getToken(options: Record<string, unknown>): Promise<string> {
    if (options.token && typeof options.token === "string") {
      return options.token;
    }

    // Otherwise, load from config file
    const config = await this.loadConfig();

    if (!config.token) {
      console.error(
        "Error: API token is required. Use --token <your-token> or run 'webdock init' to configure."
      );
      Deno.exit(1);
    }
    return config.token;
  }
  async req<T extends unknown | undefined>(
    opts: WebdockApiRequestOptions<T>
  ): WebdockApiRequestReturn<T> {
    opts.token = opts.token || (await this.getToken({}));
    opts.method = opts.method || "GET";
    const spinner = new Spinner();

    try {
      // Add leading slash to endpoint if not present
      let formattedEndpoint = opts.endpoint;
      if (!formattedEndpoint.startsWith("/")) {
        formattedEndpoint = "/" + formattedEndpoint;
      }

      if (this.log) spinner.start();

      const response = await axios({
        url: `https://api.webdock.io/v1${formattedEndpoint}`,
        method: opts.method,
        headers: {
          Authorization: `Bearer ${opts.token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        data: opts.body as unknown as T,
        family: 4,
      });

      if (this.log) spinner.stop();

      // We don't want the entire response headers to be returned to the caller functions,
      // that's why this function takes the headers array pass,
      // and uses it's entries to extract from response headers
      const returnHeaders = {} as Record<string, string>;
      (opts.headers ?? []).forEach((e: string) => {
        if (e) {
          returnHeaders[e] = response.headers?.[e ?? ""];
        }
      });

      return {
        success: true,
        data: {
          body: response.data,
          headers: returnHeaders,
        } as unknown as T,
      };
    } catch (error) {
      if (this.log) spinner.stop();
      if (this.log) colors.red("Request failed!");

      const err = error as unknown as AxiosError<{ message: string }>;

      // Network errors and other exceptions
      if (this.log) {
        console.error(
          colors.red(
            `${_getTimestamp()} - ${err.response ? "API" : "Network"} Error${err.response ? ` [${err.response.status}]` : ""
            }: ${err.response ? err.response.statusText : err.message}`
          )
        );

        if (err.response?.data?.message) {
          console.error(
            colors.red(
              `${_getTimestamp()} - Details: ${err.response.data.message}`
            )
          );
        }
      }

      if (err.response?.status === 500 && this.log) {
        console.error(
          colors.red(
            `${_getTimestamp()} - Critical Error 500: Internal Server Error - Please contact support`
          )
        );
        Deno.exit(1);
      }

      if (err.response?.status === 401 && this.log) {
        console.error(
          colors.red(
            `${_getTimestamp()} - Authorization Error: Invalid or missing API token`
          )
        );
        Deno.exit(1);
      }

      return {
        success: false,
        error: err.response?.data?.message ?? "Unknown error",
        errorType: err.response ? "server" : "network",
        code: err.response?.status || 0,
      };
    }
  }
  async waitForEvent(callbackId: string) {
    if (this.fact) console.log(">> Did you know: " + (await uselessFacts()));

    const spinner = new Spinner();
    while (true) {
      if (this.log || this.fact) spinner.start();

      await sleep(1);

      const result = await this.req<EventLogResponse>({
        endpoint: `/events?callbackId=${callbackId}`,
        log: false,
        method: "GET",
      });
      if (this.log || this.fact) spinner.stop();

      if (!result.success) {
        console.error(result.error);
        if (this.log) Deno.exit(1);
        return;
      }

      if (result.success && result.data.body[0].status == "error") {
        console.error(result.data.body[0].message);
        if (this.log) Deno.exit(1);
        return;
      }

      if (result.success && result.data.body[0].status == "finished") {
        return result;
      }
    }
  }
}
