import { FC, useState } from "react";
import { Box, Collapse } from "@mui/material";

import { CustomBadge } from "../custom-badge";
import { useConnectParticle } from "../../hooks";
import { hooks } from "../../connectors/particle";
import { IWalletButtonProps } from "./interfaces";
import { getParticleButtonIcon } from "./utils";
import { ParticleIcon } from "../wallet-icons";
import { StyledIconButton } from "./styled";

const { useIsActive } = hooks;

export const ParticleButton: FC<IWalletButtonProps> = props => {
  const { disabled, onClick, badgeProps = {} } = props;

  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(value => !value);
  };

  const isActive = useIsActive();
  const handleClick = useConnectParticle({ onClick });

  return (
    <>
      <CustomBadge invisible={!isActive} badgeProps={badgeProps}>
        <StyledIconButton disabled={disabled} onClick={toggleOpen}>
          <ParticleIcon sx={{ width: 60, height: 60 }} />
        </StyledIconButton>
      </CustomBadge>
      <Collapse in={open}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <StyledIconButton disabled={disabled} onClick={() => handleClick("google")}>
            {getParticleButtonIcon("google")}
          </StyledIconButton>
          <StyledIconButton disabled={disabled} onClick={() => handleClick("facebook")}>
            {getParticleButtonIcon("facebook")}
          </StyledIconButton>
        </Box>
      </Collapse>
    </>
  );
};
