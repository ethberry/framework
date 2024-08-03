import { FC, Fragment, useState } from "react";
import { MonetizationOn } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, constants, Contract } from "ethers";

import { getEmptyToken } from "@gemunion/mui-inputs-asset";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IAssetComponent, IContract } from "@framework/types";
import { TokenType } from "@framework/types";
import { convertDatabaseAssetToTokenTypeAsset } from "@framework/exchange";

import topUpABI from "@framework/abis/json/TopUp/topUp.json";

import { shouldDisableByContractType } from "../../../utils";
import type { ITopUpDto } from "./dialog";
import { TopUpDialog } from "./dialog";
import { useAllowance } from "../../../../../utils/use-allowance";

export interface ITopUpButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const TopUpButton: FC<ITopUpButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address },
    disabled,
    variant,
  } = props;

  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);

  const metaFnWithAllowance = useAllowance((web3Context: Web3ContextType, values: ITopUpDto) => {
    const contract = new Contract(address, topUpABI, web3Context.provider?.getSigner());
    const asset = values.token.components[0];

    if (asset.tokenType === TokenType.NATIVE) {
      return contract.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId: 0,
            amount: asset.amount,
          },
        ],
        { value: BigNumber.from(asset.amount) },
      ) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC20) {
      return contract.topUp([
        {
          tokenType: 1,
          token: asset.contract.address,
          tokenId: 0,
          amount: asset.amount,
        },
      ]) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const metaFn = useMetamask((values: ITopUpDto, web3Context: Web3ContextType) => {
    const assets = convertDatabaseAssetToTokenTypeAsset(values.token.components as unknown as Array<IAssetComponent>);
    return metaFnWithAllowance(
      {
        contract: values.address,
        assets,
      },
      web3Context,
      values,
    );
  });

  const handleTopUp = () => {
    setIsTopUpDialogOpen(true);
  };

  const handleTopUpConfirm = async (values: ITopUpDto) => {
    await metaFn(values);
    setIsTopUpDialogOpen(false);
  };

  const handleTopUpCancel = () => {
    setIsTopUpDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleTopUp}
        icon={MonetizationOn}
        message="form.buttons.topUp"
        className={className}
        dataTestId="TopUpButton"
        disabled={disabled || shouldDisableByContractType(contract)}
        variant={variant}
      />
      <TopUpDialog
        onConfirm={handleTopUpConfirm}
        onCancel={handleTopUpCancel}
        open={isTopUpDialogOpen}
        initialValues={{
          token: getEmptyToken(),
          address,
        }}
      />
    </Fragment>
  );
};
