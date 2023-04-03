import { FC } from "react";
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Create } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import type { IPaginationDto } from "@gemunion/types-collection";
import type { IRent } from "@framework/types";
import { TokenType } from "@framework/types";

import { RentEditDialog } from "./edit";
import { cleanUpAsset } from "../../../../utils/money";

export const Rent: FC = () => {
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
  } = useCollection<IRent, IPaginationDto>({
    baseUrl: "/rents",
    empty: {
      price: getEmptyTemplate(TokenType.ERC20),
    },
    filter: ({ price }) => ({
      price: cleanUpAsset(price),
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "rent"]} />

      <PageHeader message="pages.rent.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((rent, i) => (
            <ListItem key={i}>
              <ListItemText>{rent.contract?.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(rent)}>
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

      <RentEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
