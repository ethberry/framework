import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardContent, Toolbar, Typography } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenTraitsView } from "./traits";

export interface ITraitTokenPanelProps {
  token: IToken;
}

export const TraitTokenPanel: FC<ITraitTokenPanelProps> = props => {
  const { token } = props;

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.TRAITS)) {
    return null;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters={true} sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.traits" />
          </Typography>
        </Toolbar>
        <TokenTraitsView metadata={token.metadata} />
      </CardContent>
    </Card>
  );
};
