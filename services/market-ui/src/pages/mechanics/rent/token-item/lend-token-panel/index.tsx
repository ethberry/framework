import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Card, CardActions, CardContent, Toolbar, Typography } from "@mui/material";
import { constants } from "ethers";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenLendButton } from "../../../../../components/buttons";

export interface ILendTokenPanelProps {
  token: IToken;
}

export const LendTokenPanel: FC<ILendTokenPanelProps> = props => {
  const { token } = props;

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.RENTABLE)) {
    return null;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.tokenUser" />
          </Typography>
        </Toolbar>
        <Box component="ul" sx={{ pl: 0, m: 0, listStylePosition: "inside" }}>
          {!token.metadata.user || token.metadata.user === constants.AddressZero ? "N/A" : token.metadata.user}
        </Box>
      </CardContent>
      <CardActions>
        <TokenLendButton token={token} />
      </CardActions>
    </Card>
  );
};
