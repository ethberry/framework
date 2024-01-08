import { FC } from "react";
import { IconButton } from "@mui/material";
import { AuthType } from "@particle-network/auth";

import { CustomBadge } from "../custom-badge";
import { useConnectParticle } from "../../hooks";
import { hooks } from "../../connectors/particle";
import { IWalletButtonProps } from "./interfaces";
import { getParticleButtonIcon } from "./utils";

const { useIsActive } = hooks;

export const ParticleButton: FC<IWalletButtonProps & { type: AuthType }> = props => {
  const { disabled, onClick, badgeProps = {}, iconButtonProps = {}, customIcon, type } = props;

  const isActive = useIsActive();

  const handleClick = useConnectParticle({ onClick });

  return (
    <CustomBadge invisible={!isActive} badgeProps={badgeProps}>
      <IconButton disabled={disabled} size="large" onClick={() => handleClick(type)} {...iconButtonProps}>
        {customIcon || getParticleButtonIcon(type)}
      </IconButton>
    </CustomBadge>
  );
};
