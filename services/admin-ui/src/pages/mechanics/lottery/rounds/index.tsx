import { FC } from "react";
import { Grid, Typography, Button } from "@mui/material";
import { PlayCircleFilled, CheckCircle } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const LotteryRounds: FC = () => {
  const handelStartRound = () => {};
  const handelFinishRound = () => {};

  const isStarted = false;

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.rounds"]} />

      <PageHeader message="pages.lottery.rounds.title">
        {isStarted ? (
          <Button startIcon={<CheckCircle />} onClick={handelFinishRound} data-testid="LotteryFinishRoundButton">
            <FormattedMessage id="form.buttons.finishRound" />
          </Button>
        ) : (
          <Button startIcon={<PlayCircleFilled />} onClick={handelStartRound} data-testid="LotteryStartRoundButton">
            <FormattedMessage id="form.buttons.startRound" />
          </Button>
        )}
      </PageHeader>

      <Typography>Here be dragons</Typography>
    </Grid>
  );
};
