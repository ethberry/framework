import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ITemplate, TemplateStatus } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { formatPrice } from "../../../../../utils/money";
import { useStyles } from "./styles";
import { TemplatePurchaseButton } from "../../../../../components/buttons";

export const Erc998Template: FC = () => {
  const { selected, isLoading } = useCollection<ITemplate>({
    baseUrl: "/erc998-templates",
    empty: {
      title: "",
      description: emptyStateString,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs
        path={{
          dashboard: "dashboard",
          "erc998.templates": "erc998-templates",
          "erc998.template": "erc998.template",
        }}
        data={[{}, {}, selected]}
      />

      <PageHeader message="pages.erc998.template.title" data={selected} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <Box
            component="img"
            src={selected.imageUrl}
            alt="Gemunion template image"
            sx={{ display: "block", mx: "auto", maxWidth: "70%" }}
          />
          <Typography variant="body2" color="textSecondary" component="div" sx={{ my: 1 }}>
            <RichTextDisplay data={selected.description} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          {selected.templateStatus === TemplateStatus.ACTIVE && selected.amount !== selected.cap ? (
            <Paper className={classes.paper}>
              <Typography variant="body2" color="textSecondary" component="p">
                <FormattedMessage id="pages.erc998.template.price" values={{ amount: formatPrice(selected.price) }} />
              </Typography>
              <TemplatePurchaseButton template={selected} />
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
