import React, {FC, useState} from "react";
import {FormattedMessage} from "react-intl";
import {Button, MobileStepper, Paper, Typography} from "@material-ui/core";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

import {Spinner} from "@gemunionstudio/material-ui-progress";
import {IProduct} from "@gemunionstudio/solo-types";

import useStyles from "./styles";

interface ICarouselProps {
  product: IProduct;
}

export const Carousel: FC<ICarouselProps> = props => {
  const {product} = props;

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(step => step + 1);
  };

  const handleBack = () => {
    setActiveStep(step => step - 1);
  };

  if (!product.photos.length) {
    return <Spinner />;
  }

  return (
    <div className={classes.root}>
      <Paper square elevation={0} className={classes.header}>
        <Typography>{product.photos[activeStep].title}</Typography>
      </Paper>
      <img className={classes.img} src={product.photos[activeStep].imageUrl} alt={product.photos[activeStep].title} />
      <MobileStepper
        steps={product.photos.length}
        position="static"
        variant="text"
        activeStep={activeStep}
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0} startIcon={<KeyboardArrowLeft />}>
            <FormattedMessage id="form.buttons.back" />
          </Button>
        }
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === product.photos.length - 1}
            endIcon={<KeyboardArrowRight />}
          >
            <FormattedMessage id="form.buttons.next" />
          </Button>
        }
      />
    </div>
  );
};
