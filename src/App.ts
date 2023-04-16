import {
  APIEmbed,
  EmbedBuilder,
  GuildChannel,
  Interaction,
  Message,
  ThreadChannel,
  User,
  BaseInteraction,
  ButtonInteraction,
  CommandInteraction,
  StringSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  RoleSelectMenuInteraction,
  UserSelectMenuInteraction,
  InteractionResponse,
  ModalSubmitInteraction,
} from "discord.js";
import BaseApp from "./BaseApp.js";
import { IPage } from "./Types/Paging.js";
import { IMessageData, IMessageEditData } from "./Types/Message.js";

class App extends BaseApp {
  constructor() {
    super();
  }

  async init(): Promise<void> {
    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.INFO,
      "Discord Responder Loaded"
    );
  }

  private convert(
    embed: EmbedBuilder | (APIEmbed & { content?: string }),
    paging?: IPage
  ) {
    if (embed instanceof EmbedBuilder) {
      if (paging) {
        const footer = embed.toJSON().footer;
        embed.setFooter({
          text: `Page ${paging.page} / ${paging.max}${
            footer ? ` | ${footer.text}` : ""
          }`,
          iconURL: footer ? footer.icon_url : undefined,
        });
      }
      embed = embed.toJSON();
    } else {
      if (paging) {
        const footer = embed.footer;
        embed.footer = {
          text: `Page ${paging.page} / ${paging.max}${
            footer ? ` | ${footer.text}` : ""
          }`,
          icon_url: footer ? footer.icon_url : undefined,
        };
      }
    }
    return embed;
  }

  public async send(
    location:
      | GuildChannel
      | Message
      | User
      | CommandInteraction
      | ThreadChannel
      | ButtonInteraction
      | StringSelectMenuInteraction
      | RoleSelectMenuInteraction
      | ChannelSelectMenuInteraction
      | UserSelectMenuInteraction
      | MentionableSelectMenuInteraction
      | ModalSubmitInteraction,
    embed: EmbedBuilder | (APIEmbed & { content?: string }) | null,
    {
      ephemeral,
      followUp,
      paging,
      components,
      attachments,
      content,
    }: IMessageData
  ) {
    // conversion of response to JSON

    if (embed) embed = this.convert(embed, paging);

    let message: Message | null = null;
    const messageData = {
      components: components,
      embeds: embed ? [embed] : undefined,
      content: embed && embed.content ? embed.content : content,
      files: attachments,
    };

    // send message
    if (location instanceof GuildChannel || location instanceof ThreadChannel) {
      location = location as GuildChannel | ThreadChannel;
      if (!location.isTextBased() && !location.isThread()) {
        throw new Error("Channel is not text based");
      }

      message = await location.send(messageData);
    } else if (location instanceof Message) {
      location = location as Message;
      message = await location.reply(messageData);
    } else if (location instanceof User) {
      location = location as User;
      message = await location.send(messageData);
    } else if (location instanceof BaseInteraction) {
      if (
        [
          ButtonInteraction,
          StringSelectMenuInteraction,
          CommandInteraction,
          RoleSelectMenuInteraction,
          ChannelSelectMenuInteraction,
          UserSelectMenuInteraction,
          MentionableSelectMenuInteraction,
          ModalSubmitInteraction,
        ].some((x) => location instanceof x)
      ) {
        location = location as
          | ButtonInteraction
          | StringSelectMenuInteraction
          | CommandInteraction
          | RoleSelectMenuInteraction
          | ChannelSelectMenuInteraction
          | UserSelectMenuInteraction
          | MentionableSelectMenuInteraction
          | ModalSubmitInteraction;
        if (followUp) {
          message = await location.followUp({
            ephemeral: ephemeral,
            ...messageData,
          });
        } else {
          await location.reply({
            ephemeral: ephemeral,
            ...messageData,
          });
          if (!ephemeral) {
            message = (await location.fetchReply()) as Message;
          }
        }
      }
    }

    return message;
  }

  public async edit(
    location:
      | Message
      | CommandInteraction
      | ButtonInteraction
      | StringSelectMenuInteraction
      | RoleSelectMenuInteraction
      | ChannelSelectMenuInteraction
      | UserSelectMenuInteraction
      | MentionableSelectMenuInteraction
      | ModalSubmitInteraction,
    embed: EmbedBuilder | (APIEmbed & { content?: string }) | null,
    { paging, components, attachments, content }: IMessageEditData
  ) {
    if (embed) embed = this.convert(embed, paging);

    let message: Message | null = null;
    if (location instanceof Message) {
      message = await location.edit({
        components: components,
        embeds: embed ? [embed] : undefined,
        content: embed && embed.content ? embed.content : content,
        files: attachments,
      });
    } else {
      location = location as
        | ButtonInteraction
        | StringSelectMenuInteraction
        | CommandInteraction
        | RoleSelectMenuInteraction
        | ChannelSelectMenuInteraction
        | UserSelectMenuInteraction
        | MentionableSelectMenuInteraction
        | ModalSubmitInteraction;
      message = await location.editReply({
        components: components,
        embeds: embed ? [embed] : undefined,
        content: embed && embed.content ? embed.content : content,
        files: attachments,
      });
    }
  }
}

export default App;
