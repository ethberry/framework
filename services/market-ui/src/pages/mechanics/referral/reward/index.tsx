import { FC } from "react";
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IReferralReward } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { ISearchDto } from "@gemunion/types-collection";

import { ReferralRewardViewDialog } from "./view";

export const ReferralHistory: FC = () => {
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
  } = useCollection<IReferralReward, ISearchDto>({
    baseUrl: "/referral/reward",
    empty: {
      createdAt: new Date().toISOString(),
    },
    search: {
      query: "",
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.reward"]} />

      <PageHeader message="pages.referral.reward.title" />

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((reward, i) => (
            <ListItem key={i}>
              <ListItemText>{reward.referrer}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleView(reward)}>
                  <Visibility />
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

      <ReferralRewardViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
