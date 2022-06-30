import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { useParams } from "react-router";
import { FilterList } from "@mui/icons-material";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IErc998TemplateSearchDto, IUniTemplate, UniTemplateStatus } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { TemplateItem } from "./item";
import { Erc998TemplateSearchForm } from "./form";

export interface IUniTemplateListProps {
  embedded?: boolean;
}

export const Erc998TemplateList: FC<IUniTemplateListProps> = props => {
  const { embedded } = props;

  const { id = "" } = useParams<{ id: string }>();

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IUniTemplate, IErc998TemplateSearchDto>({
      baseUrl: "/erc998-templates",
      embedded,
      search: {
        query: "",
        uniContractIds: id ? [~~id] : [],
        templateStatus: [UniTemplateStatus.ACTIVE],
        minPrice: constants.Zero.toString(),
        maxPrice: constants.WeiPerEther.toString(),
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998-templates"]} isHidden={embedded} />

      <PageHeader message="pages.erc998-templates.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <Erc998TemplateSearchForm
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
