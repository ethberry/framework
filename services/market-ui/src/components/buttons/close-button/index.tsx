import { FC } from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export interface ICloseButtonProps {
  onClick: () => void;
}

export const CloseButton: FC<ICloseButtonProps> = props => {
  const { onClick } = props;

  const handleClick = () => {
    onClick();
  };

  return (
    <IconButton
      aria-label="close"
      onClick={handleClick}
      sx={{
        position: "absolute",
        right: theme => theme.spacing(1),
        top: theme => theme.spacing(1),
        color: theme => theme.palette.grey[500],
      }}
    >
      <Close />
    </IconButton>
  );
};
