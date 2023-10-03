import type { IAddress } from "@framework/types";

export const emptyAddress = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  country: "ID",
  state: "",
  zip: "",
  isDefault: false,
} as unknown as IAddress;
