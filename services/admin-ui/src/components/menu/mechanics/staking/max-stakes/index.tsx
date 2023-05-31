import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import StakingSetMaxStakeABI from "../../../../../abis/mechanics/staking/max-stakes/setMaxStake.abi.json";

import { IStakesDto, StakesEditDialog } from "./dialog";

export interface IStakesMenuItemProps {
  contract: IContract;
}

export const StakesMenuItem: FC<IStakesMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isStakesDialogOpen, setIsStakesDialogOpen] = useState(false);

  const handleStakes = (): void => {
    setIsStakesDialogOpen(true);
  };

  const handleStakesCancel = (): void => {
    setIsStakesDialogOpen(false);
  };

  const metaFn = useMetamask((values: IStakesDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, StakingSetMaxStakeABI, web3Context.provider?.getSigner());
    return contract.setMaxStake(values.maxStake) as Promise<void>;
  });

  const handleStakesConfirmed = async (values: IStakesDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsStakesDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleStakes}>
        <ListItemIcon>
          <PaidOutlined fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.maxStakes" />
        </Typography>
      </MenuItem>
      <StakesEditDialog
        onCancel={handleStakesCancel}
        onConfirm={handleStakesConfirmed}
        open={isStakesDialogOpen}
        initialValues={{ maxStake: 0 }}
      />
    </Fragment>
  );
};
