import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, Paper, Typography } from "@mui/material";

import { Spinner } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { IErc721Dropbox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { Erc721DropboxTemplateBuyButton } from "../../../components/buttons";
import { formatMoney } from "../../../utils/money";
import { useStyles } from "./styles";

export const Erc721Dropbox: FC = () => {
  const { selected, isLoading } = useCollection<IErc721Dropbox>({
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
              <FormattedMessage id="pages.erc721-dropbox.price" values={{ amount: formatMoney(selected.price) }} />
            </Typography>
            <Erc721DropboxTemplateBuyButton dropbox={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
