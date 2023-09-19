export interface IWaitListRow {
  account: string;
}

export interface IWaitListUploadDto {
  listId: number;
  items: Array<IWaitListRow>;
}
