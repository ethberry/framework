import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent, Grid } from "@mui/material";

import { formatItemHtmlList } from "@framework/exchange";
import type { IToken } from "@framework/types";

import { Erc20TransferButton } from "../../../../../components/buttons";
import { AllowanceButton } from "../../../../exchange/wallet/allowance";
import { computeTokenAsset } from "../../../../../utils/token";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";

export interface ICommonTokenPanelProps {
  token: IToken;
}

export const CommonErc0TokenPanel: FC<ICommonTokenPanelProps> = props => {
  const { token } = props;

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            {token.template?.price ? <FormattedMessage id="pages.token.priceTitle" /> : null}
          </StyledTypography>
        </StyledToolbar>
        <StyledList component="ul">{formatItemHtmlList(token.template?.price)}</StyledList>
      </CardContent>
      <CardActions>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <Erc20TransferButton token={token} />
          </Grid>
          <Grid item xs={12}>
            <AllowanceButton token={computeTokenAsset(token)} contract={token.template?.contract} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledCard>
  );
};
