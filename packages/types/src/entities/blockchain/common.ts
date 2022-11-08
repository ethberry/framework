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
  "0xe2db241bb2fe321e8c078a17b0902f9429cee78d5f3486725d73d0356e97c842" = "TEMPLATE_ID",
  "0x76e34cd5c7c46b6bfe6b1da94d54447ea83a4af449bc62a0ef3ecae24c08031a" = "GRADE",
  "0xda9488a573bb2899ea5782d71e9ebaeb1d8291bf3812a066ec86608a697c51fc" = "RARITY",
  "0x8e3ddc4aa9e11e826949389b9fc38032713cef66f38657aa6e1599905d26e564" = "GENES",
}

export enum ModuleType {
  SYSTEM = "SYSTEM",
  HIERARCHY = "HIERARCHY",
  MYSTERY = "MYSTERY",
  WRAPPER = "WRAPPER",
  LOTTERY = "LOTTERY",
  PYRAMID = "PYRAMID",
}

export enum DurationUnit {
  DAY = "DAY",
  HOUR = "HOUR",
  MINUTE = "MINUTE",
}
