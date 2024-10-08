import { Erc20EventType, TErc20Events } from "./erc20";
import { Erc721EventType, TErc721Events } from "./erc721";
import { Erc1155EventType, TErc1155Events } from "./erc1155";
import { Erc998EventType, TErc998Events } from "./erc998";
import { Erc1363EventType, TErc1363Events } from "./erc1363";

export * from "./erc20";
export * from "./erc721";
export * from "./erc1155";
export * from "./erc998";
export * from "./erc1363";

export type THierarchyEventType =
  | Erc20EventType
  | Erc721EventType
  | Erc998EventType
  | Erc1155EventType
  | Erc1363EventType;

export type THierarchyEventData = TErc20Events | TErc721Events | TErc998Events | TErc1155Events | TErc1363Events;
