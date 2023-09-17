import { FC } from "react";
import { PhotoCamera } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import ERC20SnapshotABI from "../../../../../abis/hierarchy/erc20/snapshot/snapshot.abi.json";

export interface IErc20TokenSnapshotMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const SnapshotMenuItem: FC<IErc20TokenSnapshotMenuItemProps> = props => {
  const {
    contract: { address, contractType },
    disabled,
    variant,
  } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, ERC20SnapshotABI, web3Context.provider?.getSigner());
    return contract.snapshot() as Promise<void>;
  });

  const handleSnapshot = async () => {
    await metaFn();
  };

  if (contractType !== TokenType.ERC20) {
    return null;
  }

  return (
    <ListAction
      onClick={handleSnapshot}
      icon={PhotoCamera}
      message="form.buttons.snapshot"
      disabled={disabled}
      variant={variant}
    />
  );
};
