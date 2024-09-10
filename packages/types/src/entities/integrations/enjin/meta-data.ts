// https://github.com/ethereum/ercs/blob/master/ERCS/erc-1155.md#metadata

export interface IEnjinTokenMetadataRichProperty {
  name: string;
  value: string;
  display_value: string;
  class?: string;
  css?: Record<string, string | number>;
}

export interface IEnjinTokenMetadataArrayProperty {
  name: string;
  value: Array<string> | Array<number>;
  class: string;
}

export interface IEnjinTokenMetadata {
  name: string;
  description: string;
  image: string;
  properties: Record<string, string | IEnjinTokenMetadataRichProperty | IEnjinTokenMetadataArrayProperty>;
}
