import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { useWatch } from "react-hook-form";
import { BigNumber } from "ethers";
import { Grid, Typography } from "@mui/material";
import { IToken } from "@framework/types";
import { formatEther } from "../../../../../utils/money";

export interface IWithdrawInfoProps {
  amount: string;
  token: IToken;
}

export const WithdrawInfo: FC<IWithdrawInfoProps> = props => {
  const { amount, token } = props;

  const payeeShares = useWatch({ name: `shares` });

  return (
    <Grid>
      <Typography variant={"inherit"}>
        <FormattedMessage id="pages.wallet.withdraw.payee" />
      </Typography>
      <Typography variant={"h6"}>
        {payeeShares
          ? formatEther(
              BigNumber.from(amount).div(100).mul(payeeShares).toString(),
              token.template!.contract!.decimals,
              token.template!.contract!.symbol,
            )
          : 0}
      </Typography>
    </Grid>
  );
};
