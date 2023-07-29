import { emptyStateString } from "@gemunion/draft-js-utils";
import { IMerchant, MerchantStatus, RatePlanType } from "@framework/types";

const date = new Date();

export const emptyMerchant = {
  title: "",
  description: emptyStateString,
  email: "",
  imageUrl: "",
  wallet: "",
  merchantStatus: MerchantStatus.ACTIVE,
  social: {
    twitterUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    facebookUrl: "",
  },
  ratePlan: RatePlanType.BRONZE,
  createdAt: date.toISOString(),
} as unknown as IMerchant;
