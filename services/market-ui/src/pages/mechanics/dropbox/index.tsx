import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IDropbox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { DropboxBuyButton } from "../../../components/buttons";
import { formatPrice } from "../../../utils/money";
import { useStyles } from "./styles";

export const Dropbox: FC = () => {
  const { selected, isLoading } = useCollection<IDropbox>({
    baseUrl: "/erc721-dropboxes",
    empty: {
      description: emptyStateString,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-dropbox"]} data={[{}, selected]} />

      <PageHeader message="pages.erc721-dropbox.title" data={selected} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography variant="body2" color="textSecondary" component="p">
              <FormattedMessage id="pages.dropbox.price" values={{ amount: formatPrice(selected.price) }} />
            </Typography>
            <DropboxBuyButton dropbox={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
