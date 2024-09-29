import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";
import { stringify } from "qs";

import { ListAction, ListActions, StyledListItem } from "@framework/styled";
import type { IParameter } from "@framework/types";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";

import { emptyParameter } from "../../../components/common/interfaces";
import { uniqueBy } from "../../../utils/uniqueBy";
import { EditParameterDialog } from "./edit";

export const Parameter: FC = () => {
  const {
    rows,
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
    handleSearch,
    handleDeleteConfirm,
  } = useCollection<IParameter>({
    baseUrl: "/parameter",
    redirect: (_, search) => `/parameters/?${stringify(search)}`,
    empty: emptyParameter,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "parameters"]} />

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
        <List>
          {uniqueBy<IParameter>(rows, ["parameterName", "parameterType"]).map(parameter => (
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
        </List>
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
