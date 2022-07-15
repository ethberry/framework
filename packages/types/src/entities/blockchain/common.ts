export enum TokenType {
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC998 = "ERC998",
  ERC1155 = "ERC1155",
}

export enum TokenRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export const MetadataRecord: Record<string, string> = {
  "0x0fc35a85ba1ca29b752bf9a41b86d647e116e71f5dc2732341c669884154c3ac": "TEMPLATE_ID",
  "0x08e1ec9b1b54002f93fd04c8195a36be67f2b6b212f18cc951984bc2411b08ee": "GRADE",
  "0x29daa7827568eaaa01af346b3b05934ea63f4e23858c064cc599d07420ce3a73": "RARITY",
};
