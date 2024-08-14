import { FC } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { formatEther } from "@framework/exchange";
import type { IMysteryBox } from "@framework/types";

export interface IMysteryBoxContentProps {
  mysteryBox: IMysteryBox;
}

export const MysteryBoxContent: FC<IMysteryBoxContentProps> = props => {
  const { mysteryBox } = props;

  return (
    <Paper elevation={1} sx={{ mt: 1, p: 2 }}>
      <Grid container>
        <Grid xs={4} item>
          <Typography fontWeight={500}>
            <FormattedMessage id="form.labels.tokenType" />
          </Typography>
        </Grid>
        <Grid xs={4} item>
          <Typography fontWeight={500}>
            <FormattedMessage id="form.labels.template" />
          </Typography>
        </Grid>
        <Grid xs={4} item>
          <Typography fontWeight={500}>
            <FormattedMessage id="form.labels.amount" />
          </Typography>
        </Grid>
      </Grid>
      {mysteryBox.content!.components.map(component => (
        <Grid key={component.id} container>
          <Grid xs={4} item>
            {component.tokenType}
          </Grid>
          <Grid xs={4} item>
            {component.template!.title}
          </Grid>
          <Grid xs={4} item>
            {formatEther(component.amount, component.contract!.decimals, component.contract!.symbol)}
          </Grid>
        </Grid>
      ))}
    </Paper>
  );
};
