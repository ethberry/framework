import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { LoupeOutlined } from "@mui/icons-material";
import type { IContract, IStakingRule } from "@framework/types";
import { StakingViewDialog } from "./view";

export interface IStakingCounter {
  allUsers: string;
  allStakes: string;
  userStakes: string;
  ruleCounter: string;
}

export interface IStakingInfoMenuItemProps {
  contract: IContract;
  rule?: IStakingRule;
}

export const StakingInfoMenuItem: FC<IStakingInfoMenuItemProps> = props => {
  const { contract } = props;

  const [isStakingViewDialogOpen, setIsStakingViewDialogOpen] = useState(false);

  const handleStakingView = (): void => {
    setIsStakingViewDialogOpen(true);
  };
  const handleStakingViewCancel = (): void => {
    setIsStakingViewDialogOpen(false);
  };

  return (
    <Fragment>
      <MenuItem onClick={handleStakingView}>
        <ListItemIcon>
          <LoupeOutlined fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.stakingInfo" />
        </Typography>
      </MenuItem>

      <StakingViewDialog
        onCancel={handleStakingViewCancel}
        onConfirm={handleStakingViewCancel}
        open={isStakingViewDialogOpen}
        initialValues={{ contract }}
      />
    </Fragment>
  );
};
