import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import LinkSol from "@framework/core-contracts/artifacts/contracts/ThirdParty/LinkToken.sol/LinkToken.json";

import { AmountInput } from "../../../../../inputs/amount";
import { ContractInput } from "../../../../../inputs/contract";
import { validationSchema } from "./validation";

export interface IChainLinkFundDto {
  contractId: number;
  address: string;
  amount: string;
}

export interface IChainLinkFundDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IChainLinkFundDto, form: any) => Promise<void>;
  initialValues: IChainLinkFundDto;
}

export const ChainLinkFundDialog: FC<IChainLinkFundDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const getMaxBalance = useMetamaskValue(
    async (_decimals: number, web3Context: Web3ContextType) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(process.env.LINK_ADDR, LinkSol.abi, web3Context.provider?.getSigner());
      return contract.balanceOf(web3Context.account).then((balance: any) => {
        return utils.formatEther(balance.value);
      }) as Promise<string>;
    },
    { success: false },
  );

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.fund"
      testId="FundLinkForm"
      {...rest}
    >
      <ContractInput name="contractId" controller="chain-link" />
      <AmountInput symbol="" getMaxBalance={getMaxBalance} />
    </FormDialog>
  );
};
