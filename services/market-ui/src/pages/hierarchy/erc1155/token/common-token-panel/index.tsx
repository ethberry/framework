import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent, Grid } from "@mui/material";

import type { IBalance, IToken } from "@framework/types";

import { Erc1155TransferButton, TokenSellButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";
import { AllowanceButton } from "../../../../exchange/wallet/allowance";
import { computeTokenAsset } from "../../../../../utils/token";
import { StyledCard, StyledList, StyledTitle, StyledToolbar } from "./styled";

export interface ICommonTokenPanelProps {
  token: IToken;
}

export const CommonTokenPanel: FC<ICommonTokenPanelProps> = props => {
  const { token } = props;

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTitle gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.priceTitle" />
          </StyledTitle>
        </StyledToolbar>
        <StyledList component="ul">
          {formatPrice(token.template?.price)
            .split(", ")
            .map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
        </StyledList>
        <StyledToolbar disableGutters>
          <StyledTitle gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.balanceTitle" />
          </StyledTitle>
        </StyledToolbar>
        <StyledList component="ul">
          {token.balance?.map((balance: IBalance, index: number) => <li key={index}>{balance.amount}</li>)}
        </StyledList>
      </CardContent>
      <CardActions>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={2}>
            <TokenSellButton token={token} />
            <Erc1155TransferButton token={token} />
          </Grid>
          <Grid item xs={12}>
            <AllowanceButton token={computeTokenAsset(token)} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledCard>
  );
};
