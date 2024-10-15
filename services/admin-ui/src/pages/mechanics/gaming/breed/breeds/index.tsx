import { FC } from "react";
import { Grid, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import type { ISearchDto } from "@ethberry/types-collection";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IBreed } from "@framework/types";

import { BreedItemViewDialog } from "./view";

export const BreedBreeds: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleChangePage,
  } = useCollection<IBreed, ISearchDto>({
    baseUrl: "/breed/breeds",
    empty: {},
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "breed", "breed.breeds"]} />

      <PageHeader message="pages.breed.breeds.title" />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(breed => (
            <StyledListItem key={breed.id}>
              <ListItemText>{`${breed.token.template?.title} #${breed.token.tokenId} breeds count: ${breed.count}`}</ListItemText>
              <ListActions>
                <ListAction onClick={handleView(breed)} message="form.tips.view" icon={Visibility} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <BreedItemViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
