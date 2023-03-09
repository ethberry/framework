export interface IMerchantCreateDto {
  title: string;
  description: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  userIds: Array<number>;
}
