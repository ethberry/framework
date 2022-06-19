import { FC } from "react";
import { IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

import { useStyles } from "./styles";

declare interface IMultiCarouselButtonGroupProps {
  next?: () => void;
  previous?: () => void;
}

export const MultiCarouselButtonGroup: FC<IMultiCarouselButtonGroupProps> = props => {
  const { next, previous } = props;

  const classes = useStyles();

  return (
    <div className={classes.buttonGroup}>
      <IconButton onClick={() => previous?.()} className={classes.button}>
        <ArrowBack />
      </IconButton>
      <IconButton onClick={() => next?.()} className={classes.button}>
        <ArrowForward />
      </IconButton>
    </div>
  );
};
