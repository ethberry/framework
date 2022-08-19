import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { FormattedMessage } from "react-intl";

import { useMetamask } from "@gemunion/react-hooks-eth";
import LinkSol from "@framework/core-contracts/artifacts/contracts/ThirdParty/LinkToken.sol/LinkToken.json";

import { ChainLinkFundDialog, IChainLinkFundDto } from "./dialog";

export const ChainLinkFundButton: FC = () => {
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);

  const metaFn = useMetamask(async (values: IChainLinkFundDto, web3Context: Web3ContextType) => {
    // https://docs.chain.link/docs/link-token-contracts/
    const contract = new Contract(process.env.LINK_ADDR, LinkSol.abi, web3Context.provider?.getSigner());
    return contract.transfer(values.address, values.amount) as Promise<void>;
  });

  const handleFund = (): void => {
    setIsFundDialogOpen(true);
  };

  const handleFundConfirm = async (values: IChainLinkFundDto): Promise<void> => {
    await metaFn(values);
    setIsFundDialogOpen(false);
  };

  const handleFundCancel = () => {
    setIsFundDialogOpen(false);
  };

  return (
    <Fragment>
      <Button variant="outlined" startIcon={<Savings />} onClick={handleFund} data-testid="ChainLinkFundButton">
        <FormattedMessage id="form.buttons.fund" />
      </Button>
      <ChainLinkFundDialog
        onCancel={handleFundCancel}
        onConfirm={handleFundConfirm}
        open={isFundDialogOpen}
        initialValues={{
          contractId: 0,
          address: "",
          amount: "0",
        }}
      />
    </Fragment>
  );
};
