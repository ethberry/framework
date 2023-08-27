import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import type { ITemplate } from "@framework/types";
import { TemplateStatus } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { formatPrice } from "../../../../utils/money";
import { TemplatePurchaseButton } from "../../../../components/buttons";
import { StyledPaper } from "./styled";
import { CraftPanel } from "../../../mechanics/craft/craft-panel";

export const Erc721Template: FC = () => {
  const { selected, isLoading } = useCollection<ITemplate>({
    baseUrl: "/erc721/templates",
    empty: {
      title: "",
      description: emptyStateString,
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721", "erc721.template"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.erc721.template.title" data={selected} />

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
          {selected.templateStatus === TemplateStatus.ACTIVE &&
          (selected.cap === "0" || selected.amount !== selected.cap) ? (
            <StyledPaper>
              <Typography variant="body2" color="textSecondary" component="p">
                <FormattedMessage id="pages.erc721.template.price" values={{ amount: formatPrice(selected.price) }} />
              </Typography>
              <TemplatePurchaseButton template={selected} />
            </StyledPaper>
          ) : null}

          {selected.id ? <CraftPanel template={selected} /> : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
