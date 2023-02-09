import { FC, Fragment } from "react";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";
import { useIntl } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IContract, IVestingSearchDto } from "@framework/types";

import { VestingViewDialog } from "./view";
import { VestingTransferOwnershipButton } from "../../../../components/buttons/mechanics/vesting/transfer-ownership";
import { VestingReleaseButton } from "../../../../components/buttons";
import { emptyVestingContract } from "../../../../components/common/interfaces/empty-contract";

export const Vesting: FC = () => {
  const { account } = useWeb3React();

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
  } = useCollection<IContract, IVestingSearchDto>({
    baseUrl: `/vesting`,
    search: {
      account,
    },
    empty: emptyVestingContract,
  });

  const { formatMessage } = useIntl();

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "vesting"]} />

      <PageHeader message="pages.vesting.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((vesting, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>{JSON.parse(vesting.parameters).account}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{vesting.contractFeatures}</ListItemText>
              <ListItemSecondaryAction
                sx={{
                  top: { xs: "80%", sm: "50%" },
                  transform: { xs: "translateY(-80%)", sm: "translateY(-50%)" },
                }}
              >
                <VestingTransferOwnershipButton vesting={vesting} />
                <VestingReleaseButton vesting={vesting} />
                <Tooltip title={formatMessage({ id: "form.tips.view" })}>
                  <IconButton onClick={handleView(vesting)}>
                    <Visibility />
                  </IconButton>
                </Tooltip>
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

      <VestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Fragment>
  );
};
