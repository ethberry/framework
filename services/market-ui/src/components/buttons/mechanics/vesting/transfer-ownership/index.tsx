import { FC, Fragment, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Send } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { useIntl } from "react-intl";

import TransferOwnershipABI from "./transferOwnership.abi.json";
// import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";

import { AccountDialog, IAccountDto } from "../../../../dialogs/account";

interface IVestingSellButtonProps {
  vesting: IContract;
}

export const VestingTransferOwnershipButton: FC<IVestingSellButtonProps> = props => {
  const { vesting } = props;

  const [isTransferOwnershipDialogOpen, setIsTransferOwnershipDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((dto: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(vesting.address, TransferOwnershipABI, web3Context.provider?.getSigner());
    return contract.transferOwnership(dto.account) as Promise<any>;
  });

  const handleSell = (): void => {
    setIsTransferOwnershipDialogOpen(true);
  };

  const handleSellConfirm = async (dto: IAccountDto) => {
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
      <AccountDialog
        onConfirm={handleSellConfirm}
        onCancel={handleSellCancel}
        open={isTransferOwnershipDialogOpen}
        message="dialogs.transfer"
        testId="VestingTransferOwnershipDialogForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
