import { FC, Fragment, useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";

import { Savings } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";

import { FormattedMessage } from "react-intl";

import { useMetamask, useMetamaskValue } from "@gemunion/react-hooks-eth";

import LinkSol from "@framework/core-contracts/artifacts/contracts/ThirdParty/LinkToken.sol/LinkToken.json";

import { ChainLinkFundDialog, IChainLinkFundDto } from "./dialog";
import { formatEther } from "../../../../../utils/money";

export const ChainLinkFundButton: FC = () => {
  const { account } = useWeb3React();
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);

  const metaFnTransfer = useMetamask(async (values: IChainLinkFundDto, web3Context: Web3ContextType) => {
    // https://docs.chain.link/docs/link-token-contracts/
    const contract = new Contract(process.env.LINK_ADDR, LinkSol.abi, web3Context.provider?.getSigner());
    const subId = utils.hexZeroPad(utils.hexlify(BigNumber.from(values.subscriptionId)), 32);
    return contract.transferAndCall(process.env.VRF_ADDR, values.amount, subId) as Promise<void>;
  });

  const [currentValue, setCurrentValue] = useState<string | null>(null);

  const getAccountBalance = useMetamaskValue(
    async (_decimals: number, _symbol: string, web3Context: Web3ContextType) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(process.env.LINK_ADDR, LinkSol.abi, web3Context.provider?.getSigner());
      const value = await contract.callStatic.balanceOf(web3Context.account);
      return formatEther(value.sub(value.mod(1e14)), _decimals, _symbol);
    },
    { success: false },
  );

  useEffect(() => {
    if (currentValue || !account) {
      return;
    }

    void getAccountBalance(18, "LINK").then((balance: string) => {
      setCurrentValue(balance);
    });
  }, [account, currentValue]);

  const handleFund = (): void => {
    setIsFundDialogOpen(true);
  };

  const handleFundConfirm = async (values: IChainLinkFundDto): Promise<void> => {
    await metaFnTransfer(values).finally(() => {
      setIsFundDialogOpen(false);
    });
  };

  const handleFundCancel = () => {
    setIsFundDialogOpen(false);
  };

  return (
    <Fragment>
      <Typography variant="body1">
        <FormattedMessage id="dialogs.currentBalance" values={{ value: currentValue }} />
      </Typography>
      <Button variant="outlined" startIcon={<Savings />} onClick={handleFund} data-testid="ChainLinkFundButton">
        <FormattedMessage id="form.buttons.fund" />
      </Button>
      <ChainLinkFundDialog
        onCancel={handleFundCancel}
        onConfirm={handleFundConfirm}
        open={isFundDialogOpen}
        initialValues={{
          amount: "0",
          subscriptionId: "2",
        }}
      />
    </Fragment>
  );
};
