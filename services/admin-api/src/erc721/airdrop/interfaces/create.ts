export interface IErc721AirdropItem {
  owner: string;
  erc721TemplateId: number;
}

export interface IErc721AirdropCreateDto {
  list: Array<IErc721AirdropItem>;
}
