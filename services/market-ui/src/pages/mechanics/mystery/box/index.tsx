import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IMysterybox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { MysteryboxPurchaseButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { useStyles } from "./styles";
import { MysteryboxContent } from "../../../../components/tables/mysterybox-content";

export const MysteryBox: FC = () => {
  const { selected, isLoading } = useCollection<IMysterybox>({
    baseUrl: "/mystery/boxes",
    empty: {
      title: "",
      description: emptyStateString,
      item: {
        id: 0,
        components: [],
      },
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.box"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.mystery.box.title" data={selected} />

      <Grid container>
        <Grid item xs={9}>
          <Box component="img" sx={{ maxWidth: "100%" }} src={selected.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography variant="body2" color="textSecondary" component="p">
              <FormattedMessage
                id="pages.mystery.box.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <MysteryboxPurchaseButton mysterybox={selected} />
          </Paper>
        </Grid>
      </Grid>
      <MysteryboxContent mysterybox={selected} />
    </Fragment>
  );
};
