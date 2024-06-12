import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";

import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IPage, IPageSearchDto } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { PageEditDialog } from "./edit";

export const Page: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IPage, IPageSearchDto>({
    baseUrl: "/pages",
    empty: {
      title: "",
      description: emptyStateString,
      slug: "",
    },
    search: {
      query: "",
    },
    filter: ({ id: _id, ...rest }) => rest,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "pages"]} />

      <PageHeader message="pages.pages.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="PageCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(page => (
            <StyledListItem key={page.id}>
              <ListItemText>{page.title}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(page)} message="form.buttons.edit" icon={Create} />
                <ListAction onClick={handleDelete(page)} message="form.buttons.delete" icon={Delete} />
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
      />

      <PageEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
