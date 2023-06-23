import { FC } from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { IToken } from "@framework/types";

import { formatEther } from "../../../utils/money";

export interface IWrapperContentProps {
  wrapper: IToken;
}

export const WrapperContent: FC<IWrapperContentProps> = props => {
  const { wrapper } = props;

  return (
    <>
      <Typography variant="h5" sx={{ my: 1 }}>
        <FormattedMessage id="pages.wrapper.token.content" />
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
              <FormattedMessage id="form.labels.amount" />
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography fontWeight={500}>
              <FormattedMessage id="form.labels.token" />
            </Typography>
          </Grid>
        </Grid>
        {wrapper?.balance?.map(component => (
          <Grid key={component.id} container>
            <Grid xs={4} item>
              {component.token!.template!.contract!.contractType}
            </Grid>
            <Grid xs={4} item>
              {formatEther(
                component.amount,
                component.token!.template!.contract!.decimals,
                component.token!.template!.contract!.symbol,
              )}
            </Grid>
            <Grid xs={4} item>
              <Link
                component={RouterLink}
                to={`/${component.token!.template!.contract!.contractType!.toLowerCase()}/tokens/${component.tokenId}`}
              >
                {component.token!.template!.title}
              </Link>
            </Grid>
          </Grid>
        ))}
      </Paper>
    </>
  );
};
