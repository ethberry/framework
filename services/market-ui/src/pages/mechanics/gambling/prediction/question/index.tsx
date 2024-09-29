import { FC } from "react";
import { Grid, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import type { IPredictionQuestion, IPredictionQuestionSearchDto } from "@framework/types";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";

import { PredictionQuestionViewDialog } from "./view";

export const PredictionQuestion: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    handleSearch,
    handleViewCancel,
    handleViewConfirm,
    handleChangePage,
    handleView,
  } = useCollection<IPredictionQuestion, IPredictionQuestionSearchDto>({
    baseUrl: "/prediction/question",
    search: {
      query: "",
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "prediction"]} />

      <PageHeader message="pages.prediction.question.title" />

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(question => (
            <StyledListItem key={question.id} wrap>
              <ListItemText sx={{ width: 0.2 }}>{question.title}</ListItemText>
              <ListActions>
                <ListAction onClick={handleView(question)} message="form.tips.view" icon={Visibility} />
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

      <PredictionQuestionViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
