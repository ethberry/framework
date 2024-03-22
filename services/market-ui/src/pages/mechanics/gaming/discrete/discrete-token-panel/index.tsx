import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { useCheckAccessMetadata } from "../../../../../utils/use-check-access-metadata";
import { GradeButton } from "../../../../../components/buttons";
import { AllowanceInfoPopover } from "../../../../../components/dialogs/allowance";
import { TokenDiscreteView } from "./discrete";
import { StyledCard, StyledToolbar, StyledTypography } from "./styled";

export interface IDiscreteTokenPanelProps {
  token: IToken;
}

export const DiscreteTokenPanel: FC<IDiscreteTokenPanelProps> = props => {
  const { token } = props;

  const { account } = useWeb3React();
  const { checkAccessMetadata } = useCheckAccessMetadata();

  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (token.template?.contract?.address && account) {
      void checkAccessMetadata(void 0, {
        account,
        address: token.template.contract.address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [account, token]);

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.DISCRETE)) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.discrete" />
          </StyledTypography>
          <AllowanceInfoPopover />
        </StyledToolbar>
        <TokenDiscreteView metadata={token.metadata} />
      </CardContent>
      <CardActions>
        <GradeButton token={token} disabled={!hasAccess} />
      </CardActions>
    </StyledCard>
  );
};
