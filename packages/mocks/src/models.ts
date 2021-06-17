import {
  ICategory,
  IMerchant,
  IOrder,
  IProduct,
  IPromo,
  IToken,
  IUser,
  OrderStatus,
  ProductStatus,
  TokenType,
  UserStatus,
} from "@trejgun/solo-types";
import {DefaultLanguage} from "@trejgun/solo-constants-misc";

const date = new Date();

export const emptyOrder = {
  userId: 3,
  merchantId: 1,
  orderStatus: OrderStatus.NEW,
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

  productStatus: ProductStatus.ACTIVE,
  photos: [],
} as unknown as IProduct;

export const emptyPromo = {
  title: "",
  productId: "",
  photos: [],
} as unknown as IPromo;

export const emptyToken = {
  id: 1,
  token: "12345qwertasdfgzxcvb",
  tokenType: TokenType.EMAIL,
} as unknown as IToken;

export const emptyMerchant = {
  title: "",
  description: "",
  email: "",
  phoneNumber: "",
  users: [],
} as unknown as IMerchant;
