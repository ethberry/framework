import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent, Grid } from "@mui/material";

import type { IToken } from "@framework/types";

import { StyledCard, StyledToolbar, StyledTypography } from "../common-token-panel/styled";
import { IpfsInfuraButton } from "../../../../../components/buttons";

export interface IIpfsPanelProps {
  token: IToken;
}

export const IpfsTokenPanel: FC<IIpfsPanelProps> = props => {
  const { token } = props;

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.ipfs.title" />
          </StyledTypography>
        </StyledToolbar>
      </CardContent>

      <CardActions>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <IpfsInfuraButton tokenId={token.id} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledCard>
  );
};
