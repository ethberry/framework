import { FC } from "react";
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Create } from "@mui/icons-material";

import { IPaginationDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IAsset, IContract, IGrade } from "@framework/types";

import { GradeEditDialog } from "./edit";

const clenUpAsset = ({ components }: IAsset) => {
  return {
    components: components.map(({ tokenType, contractId, tokenId, amount }) => ({
      tokenType,
      contractId,
      tokenId,
      amount,
    })),
  };
};

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
      contract: {
        title: "",
      } as IContract,
    },
    filter: ({ gradeStrategy, growthRate, price }: any) => ({
      gradeStrategy,
      growthRate,
      price: clenUpAsset(price),
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "grades"]} />

      <PageHeader message="pages.grades.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((grade, i) => (
            <ListItem key={i}>
              <ListItemText>{grade.contract?.title}</ListItemText>
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
