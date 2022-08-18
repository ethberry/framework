import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Link } from "@mui/icons-material";
import { constants } from "ethers";

import { useSettings } from "@gemunion/provider-settings";

export const Referrer: FC = () => {
  const settings = useSettings();

  const referrer = settings.getReferrer();

  const handleRemoveReferrer = () => {
    // settings.setReferrer(void 0);
    settings.setReferrer(""); // TODO
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
