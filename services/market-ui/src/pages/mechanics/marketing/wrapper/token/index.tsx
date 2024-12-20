import { FC, Fragment } from "react";
import { Grid, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/provider-collection";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { formatItem } from "@framework/exchange";
import type { ITemplate, IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { OpenSeaSellButton } from "../../../../../components/buttons";
import { WrapperContent } from "./wrapper-content";
import { StyledImage, StyledPaper } from "./styled";

export const WrapperToken: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/wrapper-tokens",
    empty: {
      template: {
        title: "",
        description: emptyStateString,
      } as ITemplate,
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs
        path={{
          dashboard: "dashboard",
          "wrapper.tokens": "wrapper-tokens",
          "wrapper.token": "wrapper.token",
        }}
        data={[{}, {}, selected.template]}
      />

      <PageHeader message="pages.wrapper.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <StyledImage component="img" src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {selected.template?.contract?.contractModule === ModuleType.HIERARCHY ||
          selected.template?.contract?.contractModule === ModuleType.MYSTERY ? (
            <StyledPaper>
              <Typography>
                <FormattedMessage
                  id="pages.wrapper.token.price"
                  values={{ amount: formatItem(selected.template?.price) }}
                />
              </Typography>
              <OpenSeaSellButton token={selected} />
            </StyledPaper>
          ) : null}
        </Grid>
      </Grid>

      <WrapperContent wrapper={selected} />
    </Fragment>
  );
};
