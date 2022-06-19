export interface IErc998AirdropItem {
  owner: string;
  erc998TemplateId: number;
}

export interface IErc998AirdropCreateDto {
  list: Array<IErc998AirdropItem>;
}
