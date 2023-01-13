import { FC } from "react";
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Create } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import type { IPaginationDto } from "@gemunion/types-collection";
import type { IContract, IGrade } from "@framework/types";

import { GradeEditDialog } from "./edit";
import { cleanUpAsset } from "../../../../utils/money";

export const Grade: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleChangePage,
  } = useCollection<IGrade, IPaginationDto>({
    baseUrl: "/grades",
    empty: {
      growthRate: 0,
      price: emptyPrice as any,
      contract: {
        title: "",
      } as IContract,
    },
    filter: ({ gradeStrategy, growthRate, price, attribute }) => ({
      gradeStrategy,
      growthRate,
      attribute,
      price: cleanUpAsset(price),
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "grade"]} />

      <PageHeader message="pages.grade.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((grade, i) => (
            <ListItem key={i}>
              <ListItemText>
                {grade.contract?.title} ({grade.attribute})
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(grade)}>
                  <Create />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <GradeEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
