import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";

import type { ISearchDto } from "@gemunion/types-collection";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IParameter } from "@framework/types";

import { emptyParameter } from "../../../components/common/interfaces";
import { EditParameterDialog } from "./edit";

export const Parameter: FC = () => {
  const {
    rows,
    search,
    selected,
    isLoading,
    action,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleDeleteConfirm,
  } = useCollection<IParameter, ISearchDto>({
    baseUrl: "/ecommerce/parameters",
    search: {
      query: "",
    },
    empty: emptyParameter,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ecommerce", "parameters"]} />

      <PageHeader message="pages.parameters.title">
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleCreate}
          data-testid="EcommerceParameterCreateButton"
        >
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(parameter => (
            <StyledListItem key={parameter.id}>
              <ListItemText>
                {parameter.parameterName} ({parameter.parameterType})
              </ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(parameter)}
                  message="form.buttons.edit"
                  dataTestId="ParameterEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(parameter)}
                  message="form.buttons.delete"
                  dataTestId="ParameterDeleteButton"
                  icon={Delete}
                />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
        getTitle={(parameter: IParameter) => parameter.parameterName}
      />

      <EditParameterDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
        parameters={rows}
      />
    </Grid>
  );
};
