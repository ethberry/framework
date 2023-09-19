import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, constants, Contract } from "ethers";

import { getEmptyToken } from "@gemunion/mui-inputs-asset";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import TopUpABI from "../../../../../abis/exchange/top-up/topUp.abi.json";

import { ITopUpDto, TopUpDialog } from "./dialog";

export interface ITopUpMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const TopUpMenuItem: FC<ITopUpMenuItemProps> = props => {
  const {
    contract: { address },
    disabled,
    variant,
  } = props;

  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);

  const metaFn = useMetamask((values: ITopUpDto, web3Context: Web3ContextType) => {
    const asset = values.token.components[0];
    const contract = new Contract(address, TopUpABI, web3Context.provider?.getSigner());
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
      // const contract = new Contract(address, VestingSol.abi, web3Context.provider?.getSigner());
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
        icon={AddCircleOutline}
        message="form.buttons.topUp"
        disabled={disabled}
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
