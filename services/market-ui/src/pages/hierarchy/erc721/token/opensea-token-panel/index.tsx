import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { CardActions, CardContent, Grid } from "@mui/material";

import type { IToken } from "@framework/types";
import { OpenSea16SupportedChains, NodeEnv } from "@framework/types";

import { StyledCard, StyledToolbar, StyledTypography } from "../common-token-panel/styled";
import { OpenSeaSellButton } from "../../../../../components/buttons";

export interface IOpenSeaTokenPanelProps {
  token: IToken;
}

export const OpenSeaTokenPanel: FC<IOpenSeaTokenPanelProps> = props => {
  const { token } = props;

  const { chainId = 0 } = useWeb3React();

  if (process.env.NODE_ENV === NodeEnv.production && !OpenSea16SupportedChains[chainId]) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.openseaTitle" />
          </StyledTypography>
        </StyledToolbar>
      </CardContent>

      <CardActions>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <OpenSeaSellButton token={token} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledCard>
  );
};
