import { FC, useEffect, useState } from "react";
import { Button, Grid, Link } from "@mui/material";
import { Clear, Done } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import type { IPaginationResult } from "@ethberry/types-collection";
import { useApiCall } from "@ethberry/react-hooks";
import type { IRatePlan } from "@framework/types";
import { RatePlanType, TokenType } from "@framework/types";

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

const prices = {
  [RatePlanType.BRONZE]: 2000,
  [RatePlanType.SILVER]: 5000,
  [RatePlanType.GOLD]: 9000,
};

export const RatePlan: FC = () => {
  const [ratePlans, setRatePlans] = useState<Array<IRatePlan>>([]);

  const telegramUrl = "https://t.me/gemunion";

  const { fn } = useApiCall(
    async api => {
      return api
        .fetchJson({
          url: "/rate-plans",
        })
        .then((json: IPaginationResult<IRatePlan>) => {
          setRatePlans(json.rows);
        });
    },
    { success: false },
  );

  const fetchRatePlans = (): Promise<void> => {
    return fn();
  };

  useEffect(() => {
    void fetchRatePlans();
  }, []);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ratePlan"]} />

      <PageHeader message="pages.ratePlan.title">
        <Button
          component={Link}
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          size="large"
          variant="contained"
        >
          <FormattedMessage id="pages.ratePlan.contactViaTelegram" />
        </Button>
      </PageHeader>

      <Grid container justifyContent="center" spacing={2}>
        {Object.values(RatePlanType).map((plan, index) => (
          <StyledCardWrapper item xs={12} sm={6} md={4} key={index}>
            <StyledCard>
              <StyledCardContent>
                <TitleTypography variant="h6">
                  <FormattedMessage id={`pages.ratePlan.${plan.toLowerCase()}.title`} />
                </TitleTypography>
                <PriceWrapper>
                  <PriceTypography variant="h3">${prices[plan]}</PriceTypography>
                  <MonthTypography>
                    {" / "}
                    <FormattedMessage id="pages.ratePlan.month" />
                  </MonthTypography>
                </PriceWrapper>
                <Divider />
                <FeaturesWrapper>
                  {ratePlans
                    .filter(ratePlan => ratePlan.ratePlan === plan)
                    .filter((ratePlan, position, array) => {
                      return (
                        !position || !(ratePlan.contractType === TokenType.ERC721 && !array[position - 1].contractType)
                      );
                    })
                    .map((ratePlan, index) => (
                      <FeatureWrapper key={index}>
                        <FeatureIconWrapper>
                          {ratePlan.amount ? (
                            <FeatureIconIncluded component={Done} />
                          ) : (
                            <FeatureIconExcluded component={Clear} />
                          )}
                        </FeatureIconWrapper>
                        <FeatureTypography included={!!ratePlan.amount}>
                          <FormattedMessage
                            id={`pages.ratePlan.${ratePlan.contractModule.toLowerCase()}.${ratePlan.contractType?.toLowerCase()}`}
                          />
                        </FeatureTypography>
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
              <TitleTypography variant="h6">
                <FormattedMessage id="pages.ratePlan.alwaysIncluded.title" />
              </TitleTypography>
              <Divider />
              <Grid container spacing={{ sm: 0, md: 4 }} justifyContent="center">
                <Grid item xs={12} sm={6} md={6} justifyContent="center">
                  <FeatureWrapper sx={{ justifyContent: "center" }}>
                    <FeatureIconWrapper>
                      <FeatureIconIncluded component={Done} />
                    </FeatureIconWrapper>
                    <FeatureTypography included>
                      <FormattedMessage id="pages.ratePlan.alwaysIncluded.history" />
                    </FeatureTypography>
                  </FeatureWrapper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} justifyContent="center">
                  <FeatureWrapper sx={{ justifyContent: "center" }}>
                    <FeatureIconWrapper>
                      <FeatureIconIncluded component={Done} />
                    </FeatureIconWrapper>
                    <FeatureTypography included>
                      <FormattedMessage id="pages.ratePlan.alwaysIncluded.openSea" />
                    </FeatureTypography>
                  </FeatureWrapper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} justifyContent="center">
                  <FeatureWrapper sx={{ justifyContent: "center" }}>
                    <FeatureIconWrapper>
                      <FeatureIconIncluded component={Done} />
                    </FeatureIconWrapper>
                    <FeatureTypography included>
                      <FormattedMessage id="pages.ratePlan.alwaysIncluded.insights" />
                    </FeatureTypography>
                  </FeatureWrapper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} justifyContent="center">
                  <FeatureWrapper sx={{ justifyContent: "center" }}>
                    <FeatureIconWrapper>
                      <FeatureIconIncluded component={Done} />
                    </FeatureIconWrapper>
                    <FeatureTypography included>
                      <FormattedMessage id="pages.ratePlan.alwaysIncluded.dispenser" />
                    </FeatureTypography>
                  </FeatureWrapper>
                </Grid>
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </StyledCardWrapper>
      </Grid>
    </Grid>
  );
};
