import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardContent, Toolbar, Typography } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenGenesisView } from "./genesis";

export interface IGenesTokenPanelProps {
  token: IToken;
}

export const GenesTokenPanel: FC<IGenesTokenPanelProps> = props => {
  const { token } = props;

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.GENES)) {
    return null;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters={true} sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.genesis" />
          </Typography>
        </Toolbar>
        <TokenGenesisView metadata={token.metadata} />
      </CardContent>
    </Card>
  );
};
