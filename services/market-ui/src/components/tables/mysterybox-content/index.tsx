import { FC } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { IMysterybox } from "@framework/types";

import { formatEther } from "../../../utils/money";

export interface IMysteryboxContentProps {
  mysterybox: IMysterybox;
}

export const MysteryboxContent: FC<IMysteryboxContentProps> = props => {
  const { mysterybox } = props;

  return (
    <>
      <Typography variant="h5" sx={{ my: 1 }}>
        <FormattedMessage id="pages.mystery.box.content" />
      </Typography>
      <Paper elevation={1} sx={{ my: 1, p: 2 }}>
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
        {mysterybox.item!.components.map(component => (
          <Grid key={component.id} container>
            <Grid xs={4} item>
              {component.tokenType}
            </Grid>
            <Grid xs={4} item>
              {component.template!.title}
            </Grid>
            <Grid xs={4} item>
              {formatEther(component.amount, component.contract!.decimals, "")}
            </Grid>
          </Grid>
        ))}
      </Paper>
    </>
  );
};
