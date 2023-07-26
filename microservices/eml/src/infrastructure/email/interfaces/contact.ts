import { ContactType } from "@framework/types";

export interface IContactPayload extends Record<string, string> {
  contactType: ContactType;
  displayName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  message: string;
  features: string;
}
