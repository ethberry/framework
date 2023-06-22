import { FC } from "react";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";
import { Add, Create } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import type { IPaginationDto } from "@gemunion/types-collection";
import type { IGrade } from "@framework/types";
import { GradeStrategy } from "@framework/types";

import { cleanUpAsset } from "../../../../utils/money";
import { GradeEditDialog } from "./edit";

export const Grade: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleChangePage,
  } = useCollection<IGrade, IPaginationDto>({
    baseUrl: "/grades",
    empty: {
      contractId: 0,
      attribute: "",
      gradeStrategy: GradeStrategy.FLAT,
      growthRate: 0,
      price: emptyPrice,
    },
    filter: ({ id, contractId, attribute, gradeStatus, gradeStrategy, growthRate, price }) =>
      id
        ? {
            gradeStatus,
            gradeStrategy,
            growthRate,
            price: cleanUpAsset(price),
          }
        : {
            contractId,
            attribute,
            gradeStrategy,
            growthRate,
            price: cleanUpAsset(price),
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "grade"]} />

      <PageHeader message="pages.grade.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

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
