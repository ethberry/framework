import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IMysterybox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { MysteryboxPurchaseButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { useStyles } from "./styles";

export const MysteryboxBox: FC = () => {
  const { selected, isLoading } = useCollection<IMysterybox>({
    baseUrl: "/mysterybox-boxes",
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
      <Breadcrumbs path={["dashboard", "mysterybox-boxes", "mysterybox-box"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.mysterybox-box.title" data={selected} />

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
              <FormattedMessage
                id="pages.mysterybox.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <MysteryboxPurchaseButton mysterybox={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
