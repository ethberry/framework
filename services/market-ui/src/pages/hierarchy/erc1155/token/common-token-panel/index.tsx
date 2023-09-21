import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Card, CardActions, CardContent, Toolbar, Typography } from "@mui/material";

import type { IBalance, IToken } from "@framework/types";

import { Erc1155TransferButton, TokenSellButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";

export interface ICommonTokenPanelProps {
  token: IToken;
}

export const CommonTokenPanel: FC<ICommonTokenPanelProps> = props => {
  const { token } = props;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.priceTitle" />
          </Typography>
        </Toolbar>
        <Box component="ul" sx={{ pl: 0, m: 0, listStylePosition: "inside" }}>
          {formatPrice(token.template?.price)
            .split(", ")
            .map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
        </Box>
        <Toolbar disableGutters sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.balanceTitle" />
          </Typography>
        </Toolbar>
        <Box component="ul" sx={{ pl: 0, m: 0, listStylePosition: "inside" }}>
          {token.balance?.map((balance: IBalance, index: number) => <li key={index}>{balance.amount}</li>)}
        </Box>
      </CardContent>
      <CardActions>
        <TokenSellButton token={token} />
        <Erc1155TransferButton token={token} />
      </CardActions>
    </Card>
  );
};
