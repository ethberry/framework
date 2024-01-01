import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Link } from "@mui/icons-material";
import { constants } from "ethers";

import { useAppDispatch, useAppSelector, settingsActions } from "@gemunion/redux";

export const Referrer: FC = () => {
  const { referrer } = useAppSelector(state => state.settings);
  const { setReferrer } = settingsActions;
  const dispatch = useAppDispatch();

  const handleRemoveReferrer = () => {
    dispatch(setReferrer(constants.AddressZero));
  };

  if (referrer === constants.AddressZero) {
    return null;
  }

  return (
    <Tooltip title={referrer} enterDelay={300}>
      <IconButton color="inherit" onClick={handleRemoveReferrer} data-testid="RemoveReferrerButton">
        <Link />
      </IconButton>
    </Tooltip>
  );
};
