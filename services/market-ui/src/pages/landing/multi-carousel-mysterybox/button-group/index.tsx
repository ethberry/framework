import { FC } from "react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { ButtonGroupProps } from "react-multi-carousel";

import { StyledIconButton, StyledWrapper } from "./styled";

export const MultiCarouselButtonGroup: FC<ButtonGroupProps> = props => {
  const { next, previous } = props;
  return (
    <StyledWrapper>
      <StyledIconButton onClick={previous}>
        <ArrowBack />
      </StyledIconButton>
      <StyledIconButton onClick={next}>
        <ArrowForward />
      </StyledIconButton>
    </StyledWrapper>
  );
};
