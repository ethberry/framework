import { FC } from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import type { IMysteryBox } from "@framework/types";
import { TokenType } from "@framework/types";

import { formatEther } from "../../../../../utils/money";

export interface IMysteryBoxContentProps {
  mysteryBox: IMysteryBox;
}

export const MysteryBoxContent: FC<IMysteryBoxContentProps> = props => {
  const { mysteryBox } = props;

  if (!mysteryBox) {
    return null;
  }

  return (
    <>
      <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
        <FormattedMessage id="pages.mystery.box.content" />
      </Typography>
      <Paper elevation={1} sx={{ my: 2, p: 1 }}>
        <Grid container>
          <Grid xs={4} item>
            <Typography fontWeight={450}>
              <FormattedMessage id="form.labels.tokenType" />
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography fontWeight={450}>
              <FormattedMessage id="form.labels.template" />
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography fontWeight={450}>
              <FormattedMessage id="form.labels.amount" />
            </Typography>
          </Grid>
        </Grid>
        {mysteryBox.item?.components.map(component => (
          <Grid key={component.id} container>
            <Grid xs={4} item>
              {component.tokenType}
            </Grid>
            <Grid xs={4} item>
              {component.tokenType !== TokenType.ERC20 ? (
                <Link
                  component={RouterLink}
                  to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId as number}`}
                >
                  {component.template!.title}
                </Link>
              ) : (
                component.template!.title
              )}
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
