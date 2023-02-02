import { IPage } from "./Paging";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  UserSelectMenuBuilder,
  MentionableSelectMenuBuilder,
} from "discord.js";

export interface IMessageData {
  ephemeral?: boolean;
  paging?: IPage;
  followUp?: boolean;
  components?: ActionRowBuilder<
    | StringSelectMenuBuilder
    | ButtonBuilder
    | RoleSelectMenuBuilder
    | ChannelSelectMenuBuilder
    | UserSelectMenuBuilder
    | MentionableSelectMenuBuilder
  >[];
  attachments?: AttachmentBuilder[];
  content?: string;
}

export interface IMessageEditData {
  paging?: IPage;
  components?: ActionRowBuilder<
    | StringSelectMenuBuilder
    | ButtonBuilder
    | RoleSelectMenuBuilder
    | ChannelSelectMenuBuilder
    | UserSelectMenuBuilder
    | MentionableSelectMenuBuilder
  >[];
  attachments?: AttachmentBuilder[];
  content?: string;
}
