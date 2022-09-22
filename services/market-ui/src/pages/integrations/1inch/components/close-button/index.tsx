import { FC } from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

import { useStyles } from "./styles";

export interface ICloseButtonProps {
  onClick: () => void;
}

export const CloseButton: FC<ICloseButtonProps> = props => {
  const { onClick } = props;

  const classes = useStyles();

  const handleClick = () => {
    onClick();
  };

  return (
    <IconButton aria-label="close" onClick={handleClick} className={classes.button}>
      <Close />
    </IconButton>
  );
};
