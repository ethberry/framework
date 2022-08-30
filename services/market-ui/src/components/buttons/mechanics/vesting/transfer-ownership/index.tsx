import { FC, Fragment, useState } from "react";
import { IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IVesting } from "@framework/types";

import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";
import { IVestingTransferOwnershipDto, VestingTransferOwnershipDialog } from "./dialog";

interface IVestingSellButtonProps {
  vesting: IVesting;
}

export const VestingTransferOwnershipButton: FC<IVestingSellButtonProps> = props => {
  const { vesting } = props;

  const [isTransferOwnershipDialogOpen, setIsTransferOwnershipDialogOpen] = useState(false);

  const metaFn = useMetamask(async (dto: IVestingTransferOwnershipDto, web3Context: Web3ContextType) => {
    const contract = new Contract(vesting.address, CliffVestingSol.abi, web3Context.provider?.getSigner());
    return contract.transferOwnership(dto.account) as Promise<void>;
  });

  const handleSell = (): void => {
    setIsTransferOwnershipDialogOpen(true);
  };

  const handleSellConfirm = async (dto: IVestingTransferOwnershipDto) => {
    await metaFn(dto).finally(() => {
      setIsTransferOwnershipDialogOpen(false);
    });
  };

  const handleSellCancel = () => {
    setIsTransferOwnershipDialogOpen(false);
  };

  return (
    <Fragment>
      <IconButton onClick={handleSell} data-testid="VestingTransferOwnershipButton">
        <Send />
      </IconButton>
      <VestingTransferOwnershipDialog
        onConfirm={handleSellConfirm}
        onCancel={handleSellCancel}
        open={isTransferOwnershipDialogOpen}
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
