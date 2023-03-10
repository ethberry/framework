import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import { TextInput } from "@gemunion/mui-inputs-core";

import BalanceOfABI from "../balanceOf.abi.json";
// import LinkSol from "@framework/core-contracts/artifacts/contracts/ThirdParty/LinkToken.sol/LinkToken.json";

import { AmountInput } from "../inputs/amount";
import { validationSchema } from "./validation";
import { formatEther } from "../../../../../../utils/money";

export interface IChainLinkFundDto {
  subscriptionId: string;
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

  const getCurrentBalance = useMetamaskValue(
    async (_decimals: number, web3Context: Web3ContextType) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(process.env.LINK_ADDR, BalanceOfABI, web3Context.provider?.getSigner());
      const value = await contract.callStatic.balanceOf(web3Context.account);

      return formatEther(value.sub(value.mod(1e14)), _decimals, "LINK ");
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
      <TextInput name="subscriptionId" />
      <AmountInput symbol="LINK " decimals={18} getCurrentBalance={getCurrentBalance} />
    </FormDialog>
  );
};
