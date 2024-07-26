import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList, Done } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IPredictionQuestion, IPredictionQuestionSearchDto } from "@framework/types";
import { PredictionQuestionStatus } from "@framework/types";
import { cleanUpAsset } from "@framework/exchange";

import { PredictionResultDialog } from "./result";
import { PredictionQuestionEditDialog } from "./edit";
import {
  PredictionQuestionResolveButton,
  PredictionQuestionReleaseButton,
  PredictionQuestionStartButton,
} from "../../../../../components/buttons";

export const PredictionQuestions: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    action,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleCreate,
    handleView,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
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
      maxVotes: 0,
    },
    search: {
      query: "",
      questionStatus: [],
    },
    filter: ({ id, title, description, questionStatus, price, contractId, maxVotes }) =>
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
            maxVotes,
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
                <ListAction
                  onClick={handleEdit(question)}
                  message="form.buttons.edit"
                  dataTestId="QuestionEditButton"
                  icon={Create}
                />
                <ListAction onClick={handleView(question)} message="form.buttons.resolve" icon={Done} />
                <PredictionQuestionStartButton question={question} />
                <PredictionQuestionResolveButton question={question} />
                <PredictionQuestionReleaseButton question={question} />
                <ListAction
                  onClick={handleDelete(question)}
                  message="form.buttons.delete"
                  dataTestId="QuestionDeleteButton"
                  icon={Delete}
                  disabled={question.questionStatus === PredictionQuestionStatus.INACTIVE}
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
        open={action === CollectionActions.delete}
        initialValues={selected}
      />

      <PredictionQuestionEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />

      <PredictionResultDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
