import { FC } from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { formatEther } from "@framework/exchange";
import type { IAsset } from "@framework/types";
import { TokenType } from "@framework/types";

export interface IMysteryBoxContentProps {
  content?: IAsset;
}

export const BoxContent: FC<IMysteryBoxContentProps> = props => {
  const { content } = props;

  if (!content?.components.length) {
    return null;
  }

  return (
    <>
      <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
        <FormattedMessage id="pages.mystery.box.content" />
      </Typography>
      <Paper elevation={1} sx={{ mv: 2, p: 1 }}>
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
        {content.components.map(component => (
          <Grid key={component.id} container>
            <Grid xs={4} item>
              {component.tokenType}
            </Grid>
            <Grid xs={4} item>
              {component.tokenType !== TokenType.ERC20 ? (
                <Link
                  component={RouterLink}
                  to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId!}`}
                >
                  {`${component.amount} x ${component.template?.title}`}
                </Link>
              ) : (
                component.template!.title
              )}
            </Grid>
            <Grid xs={4} item>
              {formatEther(component.amount, component.template!.contract!.decimals, "")}
            </Grid>
          </Grid>
        ))}
      </Paper>
    </>
  );
};
