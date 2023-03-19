import { useIntl } from "react-intl";

import { IAddress } from "@framework/types";

export const useFormatAddress = (): { formatAddress: (address: IAddress) => string } => {
  const { formatMessage } = useIntl();

  return {
    formatAddress: (address: IAddress): string => {
      const { addressLine1, addressLine2, city, country, state, zip } = address;

      return `${formatMessage({ id: `enums.country.${country}` })}${
        state ? `, ${state}` : ""
      }, ${city}, ${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}, ${zip}`;
    },
  };
};
