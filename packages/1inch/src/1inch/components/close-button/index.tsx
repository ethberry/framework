import { FC } from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

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
        right: 8,
        top: 8,
        color: grey[500],
      }}
    >
      <Close />
    </IconButton>
  );
};
