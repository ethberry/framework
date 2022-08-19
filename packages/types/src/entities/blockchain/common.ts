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

export enum MetadataHash {
  "0x9319bf1fd23873eaf43c06bb91a1db3e678411d693e959f1512879196908f12c" = "template_id",
  "0x08e1ec9b1b54002f93fd04c8195a36be67f2b6b212f18cc951984bc2411b08ee" = "grade",
  "0x29daa7827568eaaa01af346b3b05934ea63f4e23858c064cc599d07420ce3a73" = "rarity",
}

export enum ModuleType {
  CORE = "CORE",
  MYSTERYBOX = "MYSTERYBOX",
  LOTTERY = "LOTTERY",
}
