import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";
import { stringify } from "qs";

import { IParameter } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";

import { emptyParameter } from "../../../components/common/interfaces";
import { uniqueBy } from "../../../utils/uniqueBy";
import { ListAction, ListActions } from "../../../components/common/lists";
import { EditParameterDialog } from "./edit";

export const Parameter: FC = () => {
  const {
    rows,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    isDeleteDialogOpen,
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
            <ListItem key={parameter.id}>
              <ListItemText>
                {parameter.parameterName} ({parameter.parameterType})
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(parameter)} icon={Create} message="form.buttons.edit" />
                <ListAction onClick={handleDelete(parameter)} icon={Delete} message="form.buttons.delete" />
              </ListActions>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={selected}
        getTitle={(parameter: IParameter) => parameter.parameterName}
      />

      <EditParameterDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
        parameters={rows}
      />
    </Grid>
  );
};
