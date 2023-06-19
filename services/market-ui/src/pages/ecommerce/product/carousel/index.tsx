import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button, MobileStepper, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import { Spinner } from "@gemunion/mui-page-layout";
import { IProduct } from "@framework/types";

import { Root, StyledHeader, StyledImage } from "./styled";

interface ICarouselProps {
  product: IProduct;
}

export const Carousel: FC<ICarouselProps> = props => {
  const { product } = props;

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
    <Root>
      <StyledHeader square elevation={0}>
        <Typography>{product.photos[activeStep].title}</Typography>
      </StyledHeader>
      <StyledImage component="img" src={product.photos[activeStep].imageUrl} alt={product.photos[activeStep].title} />
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
    </Root>
  );
};
