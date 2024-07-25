import { FC } from "react";
import { Grid, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import type { ISearchDto } from "@gemunion/types-collection";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IBreed } from "@framework/types";

import { BreedLimitButton } from "../../../../../components/buttons";
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

      <PageHeader message="pages.breed.breeds.title">
        <BreedLimitButton />
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(breed => (
            <StyledListItem key={breed.id}>
              {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
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
