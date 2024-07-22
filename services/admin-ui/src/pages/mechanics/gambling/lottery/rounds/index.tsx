import { FC } from "react";
import { Grid, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import type { ISearchDto } from "@gemunion/types-collection";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { ILotteryRound } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { LotteryReleaseButton, LotteryRoundEndButton } from "../../../../../components/buttons";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { LotteryRoundViewDialog } from "./view";

export const LotteryRounds: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
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

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.rounds"]} />

      <PageHeader message="pages.lottery.rounds.title" />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(round => (
          <ListItem key={round.id} account={account} contract={round.contract}>
            <ListItemText sx={{ width: 0.2 }}>
              {round.contract?.title} #{round.roundId}
            </ListItemText>
            <ListActions>
              <ListAction onClick={handleView(round)} message="form.tips.view" icon={Visibility} />
              <LotteryReleaseButton round={round} onRefreshPage={handleRefreshPage} />
              <LotteryRoundEndButton
                contract={round.contract!}
                disabled={
                  round.contract!.contractStatus === ContractStatus.INACTIVE ||
                  round.contract!.parameters.roundId !== round.id
                }
              />
            </ListActions>
          </ListItem>
        ))}
      </WithCheckPermissionsListWrapper>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <LotteryRoundViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
