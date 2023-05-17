import { FC } from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { IMysterybox, TokenType } from "@framework/types";

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
              {component.tokenType !== TokenType.ERC20 ? (
                <Link
                  component={RouterLink}
                  to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId as number}`}
                >
                  {component.template!.title}
                </Link>
              ) : (
                <>{component.template!.title}</>
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
