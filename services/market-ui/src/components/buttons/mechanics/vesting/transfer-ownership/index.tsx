import { FC, Fragment, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Send } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IVesting } from "@framework/types";
import { useIntl } from "react-intl";

import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";
import { IVestingTransferOwnershipDto, VestingTransferOwnershipDialog } from "./dialog";

interface IVestingSellButtonProps {
  vesting: IVesting;
}

export const VestingTransferOwnershipButton: FC<IVestingSellButtonProps> = props => {
  const { vesting } = props;

  const [isTransferOwnershipDialogOpen, setIsTransferOwnershipDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((dto: IVestingTransferOwnershipDto, web3Context: Web3ContextType) => {
    const contract = new Contract(vesting.address, CliffVestingSol.abi, web3Context.provider?.getSigner());
    return contract.transferOwnership(dto.account) as Promise<any>;
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
      <Tooltip title={formatMessage({ id: "form.tips.transfer" })}>
        <IconButton onClick={handleSell} data-testid="VestingTransferOwnershipButton">
          <Send />
        </IconButton>
      </Tooltip>
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
