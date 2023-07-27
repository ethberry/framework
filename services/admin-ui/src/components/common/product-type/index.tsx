import { FC } from "react";
import { Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Divider,
  FeaturesWrapper,
  StyledCard,
  StyledCardContent,
  StyledCardWrapper,
  SubscribeButton,
  TitleTypography,
} from "./styled";

const productTypes = [
  {
    title: "SaaS",
    text: "Perfect for startups on a budget, this plan is your gateway to the market. With our blockchain ecosystem at your fingertips, you can affordably bring your innovative ideas to life and make your mark in the gaming industry.",
    link: "/calculator-saas",
    linkTitle: "See pricing",
  },
  {
    title: "Standalone",
    text: "Transform your proven ideas into a unique gaming brand with our Whitelabel game solution. Offering customized design and adjasted mechanics, this plan empowers you to stand out in the gaming industry with a truly bespoke experience\n",
    link: "/calculator",
    linkTitle: "See pricing",
  },
  {
    title: "Enterprise",
    text: "For projects with grand ambitions, our Enterprise solution is the key to unlocking your full potential. This comprehensive package includes a dedicated development team and exclusive B2B features, designed to propel your game ecosystem to new heights of success",
    link: "/contact-enterprise",
    linkTitle: "Contact Us",
  },
];

export const ProductTypeSelection: FC = () => {
  return (
    <Grid container justifyContent="center" spacing={4}>
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
    </Grid>
  );
};
