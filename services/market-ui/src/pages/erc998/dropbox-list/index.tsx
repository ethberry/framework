import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { useParams } from "react-router";
import { FilterList } from "@mui/icons-material";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DropboxStatus, IErc998Dropbox, IDropboxSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { DropboxItem } from "./item";
import { Erc998DropboxSearchForm } from "./form";

export interface IErc998DropboxListProps {
  embedded?: boolean;
}

export const Erc998DropboxList: FC<IErc998DropboxListProps> = props => {
  const { embedded } = props;

  const { id = "" } = useParams<{ id: string }>();

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IErc998Dropbox, IDropboxSearchDto>({
      baseUrl: "/erc998-dropboxes",
      embedded,
      search: {
        query: "",
        uniContractIds: id ? [~~id] : [],
        dropboxStatus: [DropboxStatus.ACTIVE],
        minPrice: constants.Zero.toString(),
        maxPrice: constants.WeiPerEther.toString(),
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998-dropboxes"]} isHidden={embedded} />

      <PageHeader message="pages.erc998-dropboxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <Erc998DropboxSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        embedded={embedded}
      />

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
