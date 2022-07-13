import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { useParams } from "react-router";
import { FilterList } from "@mui/icons-material";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DropboxStatus, IDropbox, IDropboxSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { DropboxItem } from "./item";
import { DropboxSearchForm } from "./form";

export interface IDropboxListProps {
  embedded?: boolean;
}

export const DropboxList: FC<IDropboxListProps> = props => {
  const { embedded } = props;

  const { id = "" } = useParams<{ id: string }>();

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IDropbox, IDropboxSearchDto>({
      baseUrl: "/dropboxes",
      embedded,
      search: {
        query: "",
        contractIds: id ? [~~id] : [],
        dropboxStatus: [DropboxStatus.ACTIVE],
        minPrice: constants.Zero.toString(),
        maxPrice: constants.WeiPerEther.toString(),
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "dropboxes"]} isHidden={embedded} />

      <PageHeader message="pages.dropboxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <DropboxSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} embedded={embedded} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(dropbox => (
            <Grid item lg={4} sm={6} xs={12} key={dropbox.id}>
              <DropboxItem dropbox={dropbox} />
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
