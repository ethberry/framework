import { FC } from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { formatEther } from "@framework/exchange";
import type { IAsset } from "@framework/types";
import { TokenType } from "@framework/types";

export interface IContentProps {
  content: IAsset;
}

export const BoxContent: FC<IContentProps> = props => {
  const { content } = props;

  return (
    <Paper elevation={1} sx={{ mt: 1, p: 2 }}>
      <Typography variant="h6">
        <FormattedMessage id="components.box-content.title" />
      </Typography>
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
      {content.components.map(component => (
        <Grid key={component.id} container>
          <Grid xs={4} item>
            {component.tokenType}
          </Grid>
          <Grid xs={4} item>
            {component.tokenType !== TokenType.ERC20 ? (
              <Link
                component={RouterLink}
                to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId || 0}`}
              >
                {component.template!.title}
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
  );
};
