import { FC } from "react";
import { Button, Box } from "@mui/material";
import { FormattedMessage } from "react-intl";

export const BuyCrypto: FC = () => {
  return (
    <Box mx={1}>
      <Button variant="contained" href="https://www.moonpay.com/" target="_blank">
        <FormattedMessage id="pages.1inch.buttons.buy-crypto" />
      </Button>
    </Box>
  );
};
