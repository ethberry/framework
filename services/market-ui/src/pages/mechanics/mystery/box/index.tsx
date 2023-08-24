import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IMysteryBox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { MysteryboxPurchaseButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { MysteryBoxContent } from "../../../../components/tables/mysterybox-content";

export const MysteryBox: FC = () => {
  const { selected, isLoading } = useCollection<IMysteryBox>({
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
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={selected.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="textSecondary" component="p">
              <FormattedMessage
                id="pages.mystery.box.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <MysteryboxPurchaseButton mysteryBox={selected} />
          </Paper>
        </Grid>
      </Grid>

      <MysteryBoxContent mysteryBox={selected} />
    </Fragment>
  );
};
