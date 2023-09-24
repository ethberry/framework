import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { constants } from "ethers";
import { useParams } from "react-router";
import { stringify } from "qs";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { StyledPagination } from "@framework/styled";
import type { ITemplate, ITemplateSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { TemplateSearchForm } from "../../../../components/forms/template-search";
import { TemplateListItem } from "./item";

export interface ITemplateListProps {
  embedded?: boolean;
}

export const TemplateList: FC<ITemplateListProps> = props => {
  const { embedded } = props;

  const { id } = useParams<{ id: string }>();

  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleSearch,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<ITemplate, ITemplateSearchDto>({
    baseUrl: "/templates",
    embedded,
    search: {
      query: "",
      contractIds: embedded ? [~~id!] : [],
      minPrice: constants.Zero.toString(),
      maxPrice: constants.WeiPerEther.mul(1000).toString(),
    },
    redirect: (_baseUrl, search) => `/marketplace/templates?${stringify(search)}`,
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.templates"]} isHidden={embedded} />

      <PageHeader message="pages.marketplace.templates.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <TemplateSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]}
        contractModule={[ModuleType.HIERARCHY]}
        onRefreshPage={handleRefreshPage}
        embedded={embedded}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(template => (
            <Grid item lg={4} sm={6} xs={12} key={template.id}>
              <TemplateListItem template={template} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
