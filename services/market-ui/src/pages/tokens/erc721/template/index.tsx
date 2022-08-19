import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ITemplate, TemplateStatus } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { formatPrice } from "../../../../utils/money";
import { useStyles } from "./styles";
import { TemplatePurchaseButton } from "../../../../components/buttons";

export const Erc721Template: FC = () => {
  const { selected, isLoading } = useCollection<ITemplate>({
    baseUrl: "/erc721-templates",
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
      <Breadcrumbs path={["dashboard", "erc721-templates", "erc721-templates"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.erc721-template.title" data={selected} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {selected.templateStatus === TemplateStatus.ACTIVE ? (
            <Paper className={classes.paper}>
              <Typography variant="body2" color="textSecondary" component="p">
                <FormattedMessage id="pages.erc721-template.price" values={{ amount: formatPrice(selected.price) }} />
              </Typography>
              <TemplatePurchaseButton template={selected} />
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
