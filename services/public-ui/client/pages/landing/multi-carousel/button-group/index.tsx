import React, { FC } from "react";
import { IconButton } from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";

import useStyles from "./styles";

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
