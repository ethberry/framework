import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useSeaport } from "../../../providers/seaport";

export const SeaportIncrementNonceButton: FC = () => {
  const seaport = useSeaport();

  const handleIncrementNonce = () => {
    return seaport.incrementNonce();
  };

  return (
    <Button onClick={handleIncrementNonce} data-testid="SeaportIncrementNonceButton">
      <FormattedMessage id="form.buttons.nonce" />
    </Button>
  );
};
