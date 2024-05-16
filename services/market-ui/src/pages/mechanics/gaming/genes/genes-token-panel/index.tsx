import { FC } from "react";
import { useIntl } from "react-intl";
import { CardContent } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenGenesisView } from "./genesis";
import { StyledCard } from "./styled";
import { StyledCardHeader } from "../../../../hierarchy/shared/styledCardHeader";

export interface IGenesTokenPanelProps {
  token: IToken;
}

export const GenesTokenPanel: FC<IGenesTokenPanelProps> = props => {
  const { token } = props;
  const { formatMessage } = useIntl();

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.GENES)) {
    return null;
  }

  return (
    <StyledCard>
      <StyledCardHeader title={formatMessage({ id: "pages.token.genesis" })} />
      <CardContent>
        <TokenGenesisView metadata={token.metadata} />
      </CardContent>
    </StyledCard>
  );
};
