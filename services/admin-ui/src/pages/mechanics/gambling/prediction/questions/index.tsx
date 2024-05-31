import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, Done, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IPredictionQuestion, IPredictionQuestionSearchDto } from "@framework/types";
import { PredictionQuestionStatus } from "@framework/types";
import { cleanUpAsset } from "@framework/exchange";

import { PredictionResultDialog } from "./result";
import { PredictionQuestionEditDialog } from "./edit";

export const PredictionQuestions: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isDeleteDialogOpen,
    isEditDialogOpen,
    isViewDialogOpen,
    handleToggleFilters,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IPredictionQuestion, IPredictionQuestionSearchDto>({
    baseUrl: "/prediction/questions",
    empty: {
      title: "",
      description: emptyStateString,
      price: emptyPrice,
    },
    search: {
      query: "",
      questionStatus: [],
    },
    filter: ({ id, title, description, questionStatus, price, contractId }) =>
      id
        ? {
            title,
            description,
            questionStatus,
            price: cleanUpAsset(price),
          }
        : {
            contractId,
            title,
            description,
            price: cleanUpAsset(price),
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "prediction", "prediction.questions"]} />

      <PageHeader message="pages.prediction.questions.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="QuestionCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen}>
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="questionStatus" options={PredictionQuestionStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(question => (
            <StyledListItem key={question.id}>
              <ListItemText sx={{ width: 0.6 }}>{question.title}</ListItemText>
              <ListActions dataTestId="QuestionMenuButton">
                <ListAction onClick={handleEdit(question)} message="form.buttons.edit" icon={Create} />
                <ListAction
                  onClick={handleView(question)}
                  disabled={question.questionStatus === PredictionQuestionStatus.INACTIVE}
                  icon={Done}
                  message="form.buttons.resolve"
                />
                <ListAction
                  onClick={handleDelete(question)}
                  disabled={question.questionStatus === PredictionQuestionStatus.INACTIVE}
                  icon={Delete}
                  message="form.buttons.delete"
                />
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
        open={isDeleteDialogOpen}
        initialValues={selected}
      />

      <PredictionQuestionEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />

      <PredictionResultDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
