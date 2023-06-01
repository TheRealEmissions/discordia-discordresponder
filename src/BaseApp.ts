import Base from "ts-modular-bot-file-design";
import { Dependencies, Dependency } from "ada-types";
import Events from "ada-events-types";
import DiscordClient from "ada-discordclient-types";

abstract class BaseApp extends Base {
  constructor() {
    super();
  }

  type: Dependency = Dependency.DISCORD_RESPONDER;
  name: string = "Discord Responder";
  load = true;

  @Dependencies.inject(Dependency.EVENTS)
  static Events: typeof Events;

  @Dependencies.inject(Dependency.DISCORD_CLIENT)
  static DiscordClient: typeof DiscordClient;

  abstract init(): Promise<void>;

  getDependencies(): Dependency[] {
    return [Dependency.EVENTS, Dependency.DISCORD_CLIENT];
  }
}

export default BaseApp;
