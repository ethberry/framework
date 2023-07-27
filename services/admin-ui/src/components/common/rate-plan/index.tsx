import { FC } from "react";
import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Clear, Done } from "@mui/icons-material";

import {
  Divider,
  FeatureIconExcluded,
  FeatureIconIncluded,
  FeatureIconWrapper,
  FeaturesWrapper,
  FeatureTypography,
  FeatureWrapper,
  StyledCard,
  StyledCardContent,
  StyledCardWrapper,
  TitleTypography,
} from "./styled";

// this component will be separated into its own package
export const RatePlansSelection: FC = () => {
  const { formatMessage } = useIntl();

  const plans = [
    {
      title: formatMessage({ id: "pages.ratePlan.bronze" }),
      price: "2000",
      features: [
        { name: "1 ERC20 contract", included: true },
        { name: "5 ERC721 contracts", included: true },
        { name: "5 ERC1155 contracts", included: true },
        { name: "1000 vesting contracts", included: true },
        { name: "Mass transact", included: true },
        { name: "WaitList", included: true },
        { name: "Claim", included: true },
        { name: "Grade", included: true },
        { name: "Craft", included: true },
        { name: "MysteryBox", included: false },
        { name: "Raffle", included: false },
      ],
    },
    {
      title: formatMessage({ id: "pages.ratePlan.silver" }),
      price: "5000",
      features: [
        { name: "1 ERC20 contract", included: true },
        { name: "10 ERC721 contracts", included: true },
        { name: "10 ERC1155 contracts", included: true },
        { name: "3000 vesting contracts", included: true },
        { name: "Mass transact", included: true },
        { name: "WaitList", included: true },
        { name: "Claim", included: true },
        { name: "Grade", included: true },
        { name: "Craft", included: true },
        { name: "MysteryBox", included: true },
        { name: "Raffle", included: true },
      ],
    },
    {
      title: formatMessage({ id: "pages.ratePlan.gold" }),
      price: "7000",
      features: [
        { name: "5 ERC20 contract", included: true },
        { name: "25 ERC721 contracts", included: true },
        { name: "25 ERC1155 contracts", included: true },
        { name: "5000 vesting contracts", included: true },
        { name: "Mass transact", included: true },
        { name: "WaitList", included: true },
        { name: "Claim", included: true },
        { name: "Grade", included: true },
        { name: "Craft", included: true },
        { name: "MysteryBox", included: true },
        { name: "Raffle", included: true },
      ],
    },
  ];

  return (
    <Grid container justifyContent="center" spacing={4}>
      {plans.map((plan, index) => (
        <StyledCardWrapper item xs={12} sm={6} md={4} key={index}>
          <StyledCard>
            <StyledCardContent>
              <TitleTypography variant="h6">{plan.title}</TitleTypography>
              <Divider />
              <FeaturesWrapper>
                {plan.features.map((feature, index) => (
                  <FeatureWrapper key={index}>
                    <FeatureIconWrapper>
                      {feature.included ? (
                        <FeatureIconIncluded component={Done} />
                      ) : (
                        <FeatureIconExcluded component={Clear} />
                      )}
                    </FeatureIconWrapper>
                    <FeatureTypography included={feature.included}>{feature.name}</FeatureTypography>
                  </FeatureWrapper>
                ))}
              </FeaturesWrapper>
            </StyledCardContent>
          </StyledCard>
        </StyledCardWrapper>
      ))}

      <StyledCardWrapper item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <TitleTypography variant="h6">Always included</TitleTypography>
            <Divider />
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <FeaturesWrapper>
                  <FeatureWrapper>
                    <FeatureIconWrapper>
                      <FeatureIconIncluded component={Done} />
                    </FeatureIconWrapper>
                    <FeatureTypography included>Transaction history</FeatureTypography>
                  </FeatureWrapper>
                </FeaturesWrapper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FeaturesWrapper>
                  <FeatureWrapper>
                    <FeatureIconWrapper>
                      <FeatureIconIncluded component={Done} />
                    </FeatureIconWrapper>
                    <FeatureTypography included>OpenSea integration</FeatureTypography>
                  </FeatureWrapper>
                </FeaturesWrapper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FeaturesWrapper>
                  <FeatureWrapper>
                    <FeatureIconWrapper>
                      <FeatureIconIncluded component={Done} />
                    </FeatureIconWrapper>
                    <FeatureTypography included>Marketing insights</FeatureTypography>
                  </FeatureWrapper>
                </FeaturesWrapper>
              </Grid>
            </Grid>
          </StyledCardContent>
        </StyledCard>
      </StyledCardWrapper>
    </Grid>
  );
};
