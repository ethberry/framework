import { FC } from "react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

import { StyledIconButton, StyledWrapper } from "./styled";

declare interface IMultiCarouselButtonGroupProps {
  next?: () => void;
  previous?: () => void;
}

export const MultiCarouselButtonGroup: FC<IMultiCarouselButtonGroupProps> = props => {
  const { next, previous } = props;
  return (
    <StyledWrapper>
      <StyledIconButton onClick={() => previous?.()}>
        <ArrowBack />
      </StyledIconButton>
      <StyledIconButton onClick={() => next?.()}>
        <ArrowForward />
      </StyledIconButton>
    </StyledWrapper>
  );
};
