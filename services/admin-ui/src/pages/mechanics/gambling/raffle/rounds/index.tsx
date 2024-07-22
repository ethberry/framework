import { FC } from "react";
import { Grid, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import type { ISearchDto } from "@gemunion/types-collection";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IRaffleRound } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { RaffleReleaseButton, RaffleRoundEndButton } from "../../../../../components/buttons";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { RaffleRoundViewDialog } from "./view";

export const RaffleRounds: FC = () => {
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
  } = useCollection<IRaffleRound, ISearchDto>({
    baseUrl: "/raffle/rounds",
    empty: {
      maxTickets: 0,
    },
  });

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "raffle", "raffle.rounds"]} />

      <PageHeader message="pages.raffle.rounds.title" />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(round => (
          <ListItem key={round.id} account={account} contract={round.contract}>
            <ListItemText sx={{ width: 0.2 }}>
              {round.contract?.title} #{round.roundId}
            </ListItemText>
            <ListActions>
              <ListAction onClick={handleView(round)} message="form.tips.view" icon={Visibility} />
              <RaffleReleaseButton round={round} onRefreshPage={handleRefreshPage} />
              <RaffleRoundEndButton
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

      <RaffleRoundViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
