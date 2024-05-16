import { FC } from "react";
import { useIntl } from "react-intl";
import { CardContent } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenTraitsView } from "./traits";
import { StyledCard } from "./styled";
import { StyledCardHeader } from "../../../../hierarchy/shared/styledCardHeader";

export interface ITraitTokenPanelProps {
  token: IToken;
}

export const TraitTokenPanel: FC<ITraitTokenPanelProps> = props => {
  const { token } = props;
  const { formatMessage } = useIntl();

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.TRAITS)) {
    return null;
  }

  return (
    <StyledCard>
      <StyledCardHeader title={formatMessage({ id: "pages.token.traits" })} />

      <CardContent>
        <TokenTraitsView metadata={token.metadata} />
      </CardContent>
    </StyledCard>
  );
};
