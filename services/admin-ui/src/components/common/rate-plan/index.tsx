import { FC } from "react";
import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Clear, Done } from "@mui/icons-material";

import { useRatePlans } from "./hook";
import {
  Divider,
  FeatureIconExcluded,
  FeatureIconIncluded,
  FeatureIconWrapper,
  FeaturesWrapper,
  FeatureTypography,
  FeatureWrapper,
  MonthTypography,
  PriceTypography,
  PriceWrapper,
  StyledCard,
  StyledCardContent,
  StyledCardWrapper,
  TitleTypography,
} from "./styled";

export const RatePlansSelection: FC = () => {
  const { formatMessage } = useIntl();
  const ratePlans = useRatePlans();

  return (
    <Grid container justifyContent="center" spacing={2}>
      {ratePlans.map((plan, index) => (
        <StyledCardWrapper item xs={12} sm={6} md={4} key={index}>
          <StyledCard>
            <StyledCardContent>
              <TitleTypography variant="h6">{plan.title}</TitleTypography>
              <Divider />
              <PriceWrapper>
                <PriceTypography variant="h4">{plan.price}</PriceTypography>
                <MonthTypography> / {formatMessage({ id: "pages.ratePlan.month" })}</MonthTypography>
              </PriceWrapper>
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
            <TitleTypography variant="h6">{formatMessage({ id: "pages.ratePlan.alwaysIncluded" })}</TitleTypography>
            <Divider />
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <FeatureWrapper>
                  <FeatureIconWrapper>
                    <FeatureIconIncluded component={Done} />
                  </FeatureIconWrapper>
                  <FeatureTypography included>Transaction history</FeatureTypography>
                </FeatureWrapper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FeatureWrapper>
                  <FeatureIconWrapper>
                    <FeatureIconIncluded component={Done} />
                  </FeatureIconWrapper>
                  <FeatureTypography included>OpenSea integration</FeatureTypography>
                </FeatureWrapper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FeatureWrapper>
                  <FeatureIconWrapper>
                    <FeatureIconIncluded component={Done} />
                  </FeatureIconWrapper>
                  <FeatureTypography included>Marketing insights</FeatureTypography>
                </FeatureWrapper>
              </Grid>
            </Grid>
          </StyledCardContent>
        </StyledCard>
      </StyledCardWrapper>
    </Grid>
  );
};
