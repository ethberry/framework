import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent, Grid } from "@mui/material";

import { formatItemHtmlList } from "@framework/exchange";
import { ListActionVariant } from "@framework/styled";
import type { IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { Erc721TransferButton, TokenSellButton } from "../../../../../components/buttons";
import { AllowanceButton } from "../../../../exchange/wallet/allowance";
import { AllowanceForAllButton } from "../../../../../components/buttons/hierarchy/token/allowance-for-all";
import { computeTokenAsset } from "../../../../../utils/token";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";

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
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.priceTitle" />
          </StyledTypography>
        </StyledToolbar>
        <StyledList component="ul">{formatItemHtmlList(price)}</StyledList>
      </CardContent>
      <CardActions>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <TokenSellButton token={token} />
          </Grid>
          <Grid item xs={12}>
            <Erc721TransferButton token={token} />
          </Grid>
          <Grid item xs={12}>
            <AllowanceButton token={computeTokenAsset(token)} contract={token.template?.contract} />
          </Grid>
          {token.template?.contract ? (
            <Grid item xs={12}>
              <AllowanceForAllButton contract={token.template.contract} variant={ListActionVariant.button} />
            </Grid>
          ) : null}
        </Grid>
      </CardActions>
    </StyledCard>
  );
};
