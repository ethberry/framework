import { ContactType } from "@framework/types";

export interface IContactPayload {
  contactType: ContactType;
  displayName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  text: string;
  features: string;
}
