import { FC, Fragment } from "react";
import { Button, ListItemText } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CollectionActions, useCollection } from "@gemunion/provider-collection";
import { ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IWaitListItem, IWaitListItemSearchDto } from "@framework/types";

import { WaitListClaimButton, WaitListJoinDialog } from "../../../../../components/buttons";

export const WaitListItem: FC = () => {
  const { account } = useWeb3React();

  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    handleCreate,
    handleEditConfirm,
    handleEditCancel,
    handleChangePage,
  } = useCollection<IWaitListItem, IWaitListItemSearchDto>({
    baseUrl: "/wait-list/item",
    empty: {
      account,
    },
    // @ts-ignore
    filter: ({ item: _item, ...rest }: Partial<IWaitListItem>) => rest,
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "wait-list", "wait-list.item"]} />

      <PageHeader message="pages.wait-list.item.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitListJoinButton">
          <FormattedMessage id="form.buttons.join" />
        </Button>
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(waitlist => (
            <StyledListItem key={waitlist.id} wrap>
              <ListItemText sx={{ width: 0.6 }}>{waitlist.account}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{waitlist.list?.title}</ListItemText>
              <ListActions>
                <WaitListClaimButton listItem={waitlist} />
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

      <WaitListJoinDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Fragment>
  );
};
