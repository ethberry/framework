import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IErc998Dropbox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { Erc998DropboxTemplateBuyButton } from "../../../components/buttons";
import { formatEther } from "../../../utils/money";
import { useStyles } from "./styles";

export const Erc998Dropbox: FC = () => {
  const { selected, isLoading } = useCollection<IErc998Dropbox>({
    baseUrl: "/erc998-dropboxes",
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
      <Breadcrumbs path={["dashboard", "erc998-dropbox"]} data={[{}, selected]} />

      <PageHeader message="pages.erc998-dropbox.title" data={selected} />

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
              <FormattedMessage id="pages.erc998-dropbox.price" values={{ amount: formatEther(selected.price) }} />
            </Typography>
            <Erc998DropboxTemplateBuyButton dropbox={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
