import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Card, CardActions, CardContent, Toolbar, Typography } from "@mui/material";

import type { IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { Erc721TransferButton, TokenLendButton, TokenSellButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";

export interface ICommonTokenPanelProps {
  token: IToken;
}

export const CommonTokenPanel: FC<ICommonTokenPanelProps> = props => {
  const { token } = props;

  const { price } =
    token.template?.contract?.contractModule === ModuleType.LOTTERY ||
    token.template?.contract?.contractModule === ModuleType.RAFFLE
      ? // @ts-ignore
        token.round
      : token.template;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters={true} sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.priceTitle" />
          </Typography>
        </Toolbar>
        <Box component="ul" sx={{ pl: 0, m: 0, listStylePosition: "inside" }}>
          {formatPrice(price)
            .split(", ")
            .map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
        </Box>
      </CardContent>
      <CardActions>
        <TokenSellButton token={token} />
        <Erc721TransferButton token={token} />
        <TokenLendButton token={token} />
      </CardActions>
    </Card>
  );
};
