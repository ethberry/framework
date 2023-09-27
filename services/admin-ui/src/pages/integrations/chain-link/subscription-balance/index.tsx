import { FC } from "react";
import { CardActions, CardContent, Typography } from "@mui/material";

import { FormattedMessage } from "react-intl";

import { StyledCard, StyledToolbar, StyledTypography } from "./styled";
import { ChainLinkFundButton } from "../../../../components/buttons/integrations/chain-link/fund";
import { formatEther } from "../../../../utils/money";

export interface IChainLinkBalanceProps {
  subscriptionId: number;
  walletBalance: any;
  subBalance: any;
}

export const ChainLinkSubscriptionBalance: FC<IChainLinkBalanceProps> = props => {
  const { subscriptionId, walletBalance, subBalance } = props;

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage
              id="pages.chain-link.info.title"
              values={{ value: subscriptionId || "No subscription" }}
            />
          </StyledTypography>
        </StyledToolbar>
        <Typography variant="body1" sx={{ mx: 1 }}>
          <FormattedMessage
            id="pages.chain-link.info.subscription"
            values={{ value: formatEther(subBalance.toString(), 18, "LINK") }}
          />
        </Typography>
        <Typography variant="body1" sx={{ mx: 1 }}>
          <FormattedMessage id="pages.chain-link.info.wallet" values={{ value: walletBalance }} />
        </Typography>
      </CardContent>
      <CardActions>{<ChainLinkFundButton subscriptionId={subscriptionId} />}</CardActions>
    </StyledCard>
  );
};
