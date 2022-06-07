import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { useParams } from "react-router";
import { FilterList } from "@mui/icons-material";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { Erc721TemplateStatus, IErc721Template, IErc721TemplateSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { TemplateItem } from "./item";
import { Erc721TemplateSearchForm } from "./form";

export interface IErc721TemplateListProps {
  embedded?: boolean;
}

export const Erc721TemplateList: FC<IErc721TemplateListProps> = props => {
  const { embedded } = props;

  const { id = "" } = useParams<{ id: string }>();

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IErc721Template, IErc721TemplateSearchDto>({
      baseUrl: "/erc721-templates",
      embedded,
      search: {
        query: "",
        erc721CollectionIds: id ? [~~id] : [],
        templateStatus: [Erc721TemplateStatus.ACTIVE],
        minPrice: constants.Zero.toString(),
        maxPrice: constants.WeiPerEther.toString(),
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-templates"]} isHidden={embedded} />

      <PageHeader message="pages.erc721-templates.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <Erc721TemplateSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        embedded={embedded}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(template => (
            <Grid item lg={4} sm={6} xs={12} key={template.id}>
              <TemplateItem template={template} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
