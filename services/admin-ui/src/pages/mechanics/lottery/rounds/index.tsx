import { FC } from "react";
import { Grid, List, ListItem, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { ISearchDto } from "@gemunion/types-collection";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { ILotteryRound } from "@framework/types";
import { ContractStatus, CronExpression } from "@framework/types";

import { LotteryReleaseButton } from "../../../../components/buttons/mechanics/lottery/contract/release";
import { LotteryRoundEndButton } from "../../../../components/buttons/mechanics/lottery/contract/round-end";
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
    handleRefreshPage,
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
                <ListAction onClick={handleView(round)} message="form.tips.view" icon={Visibility} />
                <LotteryReleaseButton round={round} onRefreshPage={handleRefreshPage} />
                <LotteryRoundEndButton
                  contract={round.contract!}
                  disabled={
                    round.contract!.parameters.roundId !== round.id ||
                    round.contract!.contractStatus === ContractStatus.INACTIVE ||
                    !round.contract!.parameters.vrfSubId ||
                    !round.contract!.parameters.isConsumer
                  }
                />
              </ListActions>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <StyledPagination
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
