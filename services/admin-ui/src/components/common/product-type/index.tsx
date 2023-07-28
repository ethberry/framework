import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useProductTypes } from "./hook";
import {
  Divider,
  FeaturesWrapper,
  StyledCard,
  StyledCardContent,
  StyledCardsWrapper,
  StyledCardWrapper,
  SubscribeButton,
  TitleTypography,
} from "./styled";

export const ProductTypeSelection: FC = () => {
  const productTypes = useProductTypes();

  return (
    <StyledCardsWrapper container justifyContent="center" spacing={2}>
      {productTypes.map((plan, index) => (
        <StyledCardWrapper item xs={12} sm={6} md={4} key={index}>
          <StyledCard>
            <StyledCardContent>
              <TitleTypography variant="h6">{plan.title}</TitleTypography>
              <Divider />
              <FeaturesWrapper>{plan.text}</FeaturesWrapper>
              <SubscribeButton component={RouterLink} to={plan.link} size="large" variant="contained">
                {plan.linkTitle}
              </SubscribeButton>
            </StyledCardContent>
          </StyledCard>
        </StyledCardWrapper>
      ))}
    </StyledCardsWrapper>
  );
};
