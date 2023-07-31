import { FC } from "react";
import { Button, Grid, Link } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { RatePlansSelection } from "@gemunion/license-pages";

export const RatePlan: FC = () => {
  const telegramUrl = "https://t.me/gemunion";

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

      <RatePlansSelection />
    </Grid>
  );
};
