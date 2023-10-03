import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { useMetamaskValue, useSystemContract } from "@gemunion/react-hooks-eth";
import { TextInput } from "@gemunion/mui-inputs-core";

import LinkBalanceOfABI from "../../../../../../abis/integrations/chain-link/fund/balanceOf.abi.json";

import { AmountInput } from "../inputs/amount";
import { validationSchema } from "./validation";
import { formatEther } from "../../../../../../utils/money";
import type { IContract } from "@framework/types";
import { SystemModuleType } from "@framework/types";

export interface IChainLinkFundDto {
  subscriptionId: number;
  amount: string;
}

export interface IChainLinkFundDialogProps {
  open: boolean;
  onCancel: (form: any) => void;
  onConfirm: (values: IChainLinkFundDto, form: any) => Promise<void>;
  initialValues: IChainLinkFundDto;
}

export const ChainLinkFundDialog: FC<IChainLinkFundDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const getAccountBalance = useSystemContract<IContract, SystemModuleType>(
    async (_decimals: number, web3Context: Web3ContextType, systemContract: IContract) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(
        systemContract.parameters.linkAddress.toString(),
        LinkBalanceOfABI,
        web3Context.provider?.getSigner(),
      );
      const value = await contract.callStatic.balanceOf(web3Context.account);

      return formatEther(value.sub(value.mod(1e14)), _decimals, "LINK ");
    },
    { success: false },
  );

  const metaFnBalanceData = useMetamaskValue((values: any, web3Context: Web3ContextType) => {
    return getAccountBalance(SystemModuleType.CHAIN_LINK, values, web3Context);
  });

  return (
    <FormDialog
      disabled={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.fund"
      testId="FundLinkForm"
      {...rest}
    >
      <TextInput name="subscriptionId" />
      <AmountInput symbol="LINK " decimals={18} getCurrentBalance={metaFnBalanceData} />
    </FormDialog>
  );
};
