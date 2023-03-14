export interface IMerchantCreateDto {
  title: string;
  description: string;
  email: string;
  imageUrl: string;
  userIds: Array<number>;
}
