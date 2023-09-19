import { FC } from "react";
import { Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { ISearchDto } from "@gemunion/types-collection";
import { ListAction, ListActions } from "@framework/mui-lists";
import type { ILotteryRound } from "@framework/types";
import { CronExpression } from "@framework/types";

import { LotteryReleaseButton } from "../../../../components/buttons/mechanics/lottery/contract/release";
import { LotteryRoundViewDialog } from "./view";
import { getNumbers } from "../utils";

export const LotteryRounds: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isViewDialogOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleChangePage,
  } = useCollection<ILotteryRound, ISearchDto>({
    baseUrl: "/lottery/rounds",
    empty: {
      numbers: [],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.rounds"]} />

      <PageHeader message="pages.lottery.rounds.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(round => (
            <ListItem key={round.id}>
              <ListItemText sx={{ width: 0.2 }}>{round.contract?.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>
                {round.roundId} - {round.numbers ? getNumbers(round.numbers) : "awaiting results"}
              </ListItemText>
              <ListItemText sx={{ width: 0.3 }}>
                {round.contract?.parameters.schedule
                  ? Object.keys(CronExpression)[
                      Object.values(CronExpression).indexOf(
                        round.contract?.parameters.schedule as unknown as CronExpression,
                      )
                    ]
                  : ""}
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleView(round)} icon={Visibility} message="form.tips.view" />
                <LotteryReleaseButton round={round} />
              </ListActions>
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

      <LotteryRoundViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
