import {v4} from "uuid";

import {
  ICategory,
  IMerchant,
  IOrder,
  IPage,
  IProduct,
  IPromo,
  IToken,
  IUser,
  TokenType,
  UserStatus,
} from "@gemunionstudio/solo-types";
import {DefaultLanguage} from "@gemunionstudio/solo-constants-misc";

const date = new Date();

export const emptyOrder = {
  userId: 3,
  merchantId: 1,
  productId: 1,
  price: 0,
  createdAt: date.toISOString(),
} as unknown as IOrder;

export const emptyCategory = {
  title: "",
  description: "",
  parentId: 1,
} as unknown as ICategory;

export const emptyUser = {
  password: "",
  confirm: "",
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  language: DefaultLanguage,
  imageUrl: "",
  userStatus: UserStatus.ACTIVE,
  userRoles: [],
  createdAt: date.toISOString(),
} as unknown as IUser;

export const emptyProduct = {
  title: "",
  description: "",
  price: 0,
  amount: 0,
  categories: [],
  photos: [],
} as unknown as IProduct;

export const emptyPromo = {
  title: "",
  description: "",
  productId: "",
  photos: [],
} as unknown as IPromo;

export const emptyToken = {
  id: 1,
  token: v4(),
  tokenType: TokenType.EMAIL,
} as unknown as IToken;

export const emptyMerchant = {
  title: "",
  description: "",
  email: "",
  phoneNumber: "",
  users: [],
} as unknown as IMerchant;

export const emptyPage = {
  title: "",
  description: "",
  slug: "",
} as unknown as IPage;
