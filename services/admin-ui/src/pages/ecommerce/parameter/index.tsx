import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";

import type { ISearchDto } from "@gemunion/types-collection";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IParameter } from "@framework/types";

import { emptyParameter } from "../../../components/common/interfaces";
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
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((parameter, i) => (
            <ListItem key={i}>
              <ListItemText>
                {parameter.parameterName} ({parameter.parameterType})
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(parameter)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(parameter)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
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
