import { EnabledCountries } from "@gemunion/constants";

export interface IAddressCreateDto {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: EnabledCountries;
  isDefault: boolean;
  state?: string;
  userId: number;
  zip: string;
}
