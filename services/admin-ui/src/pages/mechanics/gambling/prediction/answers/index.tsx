import { FC } from "react";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { IPredictionAnswer, IPredictionAnswerSearchDto, IPredictionQuestion } from "@framework/types";

import { PredictionAnswerViewDialog } from "./view";
import { PredictionAnswerSearchForm } from "./form";

export const PredictionAnswers: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isViewDialogOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
    handleToggleFilters,
  } = useCollection<IPredictionAnswer, IPredictionAnswerSearchDto>({
    baseUrl: "/prediction/answers",
    search: {
      questionIds: [],
    },
    empty: {
      question: {
        title: "",
      } as unknown as IPredictionQuestion,
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "prediction", "prediction.answers"]} />

      <PageHeader message="pages.prediction.answers.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <PredictionAnswerSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(answer => (
            <StyledListItem key={answer.id}>
              <ListItemText sx={{ width: 0.2 }}>{answer.question.title}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{answer.answer}</ListItemText>
              <ListActions>
                <ListAction message="form.tips.view" icon={Visibility} onClick={handleView(answer)} />
              </ListActions>
            </StyledListItem>
          ))}
        </List>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <PredictionAnswerViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
