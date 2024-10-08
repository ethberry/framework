import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { useCheckTokenOwnership } from "../../../../../utils/use-check-token-ownership";
import { DiscreteButton } from "../../../../../components/buttons";
import { AllowanceInfoPopover } from "../../../../../components/dialogs/allowance";
import { TokenDiscreteView } from "./discrete";
import { StyledCard, StyledToolbar, StyledTypography } from "./styled";

export interface IDiscreteTokenPanelProps {
  token: IToken;
}

export const DiscreteTokenPanel: FC<IDiscreteTokenPanelProps> = props => {
  const { token } = props;

  const { account } = useWeb3React();
  const { checkTokenOwnership } = useCheckTokenOwnership();

  const [hasOwnership, setHasOwnership] = useState(false);

  useEffect(() => {
    if (token.id && account) {
      void checkTokenOwnership(void 0, {
        account,
        tokenId: token.id,
      })
        .then((json: { hasOwnership: boolean }) => {
          setHasOwnership(json?.hasOwnership);
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
            <FormattedMessage id="pages.token.attributes" />
          </StyledTypography>
          <AllowanceInfoPopover />
        </StyledToolbar>
        <TokenDiscreteView metadata={token.metadata} />
      </CardContent>
      <CardActions>
        <DiscreteButton token={token} disabled={!hasOwnership} />
      </CardActions>
    </StyledCard>
  );
};
