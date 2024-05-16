import { FC } from "react";
import { useIntl } from "react-intl";
import { CardActions, Grid } from "@mui/material";

import type { IToken } from "@framework/types";

import { StyledCard } from "../common-token-panel/styled";
import { InfuraButton } from "../../../../../components/buttons/ipfs/infura";
import { StyledCardHeader } from "../../../shared/styledCardHeader";

export interface IIpfsPanelProps {
  token: IToken;
}

export const IpfsTokenPanel: FC<IIpfsPanelProps> = props => {
  const { token } = props;
  const { formatMessage } = useIntl();

  return (
    <StyledCard>
      <StyledCardHeader title={formatMessage({ id: "pages.ipfs.title" })} />

      <CardActions>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <InfuraButton tokenId={token.id} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledCard>
  );
};
