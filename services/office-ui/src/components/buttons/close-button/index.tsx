import { FC } from "react";
import { Close } from "@mui/icons-material";

import { StyledIconButton } from "./styled";

export interface ICloseButtonProps {
  onClick: () => void;
}

export const CloseButton: FC<ICloseButtonProps> = props => {
  const { onClick } = props;

  const handleClick = () => {
    onClick();
  };

  return (
    <StyledIconButton aria-label="close" onClick={handleClick}>
      <Close />
    </StyledIconButton>
  );
};
