import { FC, useEffect, useState } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useWallet } from "@gemunion/provider-wallet";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { IServerSignature } from "@gemunion/types-collection";
import { useSettings } from "@gemunion/provider-settings";
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/Lottery.sol/Lottery.json";

export const LotteryPurchase: FC = () => {
  const { isActive } = useWeb3React();
  const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();
  const [ticketNumbers, setTicketNumbers] = useState<Array<boolean>>(new Array(36).fill(false));

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: Record<string, any>, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.LOTTERY_ADDR, LotterySol.abi, web3Context.provider?.getSigner());
      return contract.purchase(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: 0,
          expiresAt: sign.expiresAt,
          referrer: settings.getReferrer(),
        },
        ticketNumbers,
        process.env.ACCOUNT,
        sign.signature,
        {
          value: constants.WeiPerEther,
        },
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/lottery/sign",
        method: "POST",
        data: {
          ticketNumbers,
        },
      },
      web3Context,
    );
  });

  const handlePurchase = () => {
    return metaFn();
  };

  const handleClick = (i: number) => {
    return () => {
      if (ticketNumbers.filter(e => e).length >= 6 && !ticketNumbers[i]) {
        return;
      }
      const newNumbers = [...ticketNumbers];
      newNumbers[i] = !newNumbers[i];
      setTicketNumbers(newNumbers);
    };
  };

  useEffect(() => {
    if (!isActive) {
      void openConnectWalletDialog();
    } else {
      void closeConnectWalletDialog();
    }
  }, [isActive]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.purchase"]} />

      <PageHeader message="pages.lottery.purchase.title">
        <Button startIcon={<Casino />} onClick={handlePurchase} data-testid="LotteryBuyTicket">
          <FormattedMessage id="form.buttons.buy" />
        </Button>
      </PageHeader>

      <Paper sx={{ width: "34em", textAlign: "center", margin: "0 auto", padding: 2 }}>
        {new Array(36).fill(null).map((e, i) => (
          <IconButton
            size="large"
            key={i}
            sx={{ width: "2em" }}
            color={ticketNumbers[i] ? "primary" : "default"}
            onClick={handleClick(i)}
          >
            {i + 1}
          </IconButton>
        ))}
      </Paper>

      <br />

      <Typography>
        <FormattedMessage id="pages.lottery.purchase.rules" />
      </Typography>
    </Grid>
  );
};
