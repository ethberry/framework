import { FC } from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { IToken, TokenType } from "@framework/types";

import { formatEther } from "../../../utils/money";

export interface IMysteryboxTokenContentProps {
  token: IToken;
}

export const MysteryboxTokenContent: FC<IMysteryboxTokenContentProps> = props => {
  const { token } = props;

  const tokenType = token.template?.contract?.contractType;
  const templateId = token.template?.priceId;

  return (
    <Grid item xs={12}>
      <Typography variant="h5" sx={{ my: 1 }}>
        <FormattedMessage id="pages.mystery.token.content" />
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
        <Grid container>
          <Grid xs={4} item>
            {token.template?.contract?.contractType}
          </Grid>
          <Grid xs={4} item>
            {tokenType !== TokenType.ERC20 ? (
              <Link
                component={RouterLink}
                to={`/${tokenType?.toLowerCase() as string}/templates/${templateId as string}`}
              >
                {token.template?.title}
              </Link>
            ) : (
              <>{token.template?.title}</>
            )}
          </Grid>
          <Grid xs={4} item>
            {formatEther(
              token.template?.price?.components[0].amount,
              token.template?.price?.components[0].contract?.decimals,
              "",
            )}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
