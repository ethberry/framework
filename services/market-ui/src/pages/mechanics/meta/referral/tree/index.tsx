import { FC, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, Button, Grid, SvgIcon, Typography } from "@mui/material";
import { ChevronRight, Done, ExpandMore, FilterList } from "@mui/icons-material";
import { TreeItem, SimpleTreeView } from "@mui/x-tree-view";
import { useWeb3React } from "@web3-react/core";
import { useClipboard } from "use-clipboard-copy";
import { enqueueSnackbar } from "notistack";

import { StyledEmptyWrapper } from "@framework/styled";
import type { IReferralReportSearchDto, IReferralTree } from "@framework/types";
import { useAppSelector } from "@gemunion/redux";
import { walletSelectors, useWallet } from "@gemunion/provider-wallet";
import { AddressLink } from "@gemunion/mui-scanner";
import { useCollection } from "@gemunion/provider-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";

import { calculateDepth, emptyRefProgram, getRefLevelShare } from "../../../../../utils/referral";
import type { IRefProgramsLevels } from "../../../../../utils/referral";
import { ReferralTreeMerchantSearchForm } from "./form";
import { StyledAlert, StyledCopyRefLinkWrapper, StyledTextField } from "./styled";

export interface IReferralTreeSearchDto extends IReferralReportSearchDto {
  merchantIds: Array<number>;
}

export const ReferralTree: FC = () => {
  const { rows, isLoading, handleSearch, search, isFiltersOpen, handleToggleFilters } = useCollection<
    IReferralTree,
    IReferralTreeSearchDto
  >({
    baseUrl: "/referral/tree",
    search: {
      merchantIds: [], // search by all merchants
    },
  });

  const clipboard = useClipboard();
  const { formatMessage } = useIntl();
  const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();
  const referrer = useAppSelector<string>(walletSelectors.referrerSelector);

  const { isActive, account = "" } = useWeb3React();

  const [copied, setCopied] = useState<boolean>(false);
  const [programs, setPrograms] = useState<Array<IRefProgramsLevels>>([emptyRefProgram]);

  const marketUrl = process.env.MARKET_FE_URL;

  const refLink = `${marketUrl}/?referrer=${account.toLowerCase()}`;

  const handleCopy = () => {
    clipboard.copy();
    enqueueSnackbar(formatMessage({ id: "snackbar.clipboard" }));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  useEffect(() => {
    if (!isActive) {
      void openConnectWalletDialog();
    } else {
      void closeConnectWalletDialog();
    }
  }, [isActive]);

  useEffect(() => {
    if (rows && rows.length) {
      setPrograms(
        rows.map(row => ({
          merchantId: row.merchantId,
          levels: row.merchant.refLevels!.map(lev => ({ level: lev.level, share: lev.share })),
        })),
      );
    }
  }, [rows]);

  const renderTreeLabel = (node: IReferralTree, idx: number) => {
    const { id, wallet, merchant, level /* share */ } = node;
    const depth = calculateDepth(rows[idx], id);
    const level0 = getRefLevelShare(programs, merchant.id, 0);
    const totalShares = level0.share / 100;
    const { share, totalCount } = getRefLevelShare(programs, merchant.id, depth || level);
    const shareLabel =
      wallet === account.toLowerCase() // SELF
        ? `Total referral program share: ${totalShares}% on ${totalCount} levels`
        : `Your share from level ${depth || level} is ${share ? share / 100 : 0}%`;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 0.5,
          pr: 0,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: "inherit", flexGrow: 1 }}>
          {wallet === account.toLowerCase() ? merchant.title : <AddressLink address={wallet} />}
        </Typography>
        {share ? (
          <Typography variant="caption" color="inherit" sx={{ fontWeight: "inherit" }}>
            {shareLabel}
          </Typography>
        ) : null}
      </Box>
    );
  };

  const renderTree = (row: IReferralTree, idx: number) => (
    <TreeItem key={row.id} itemId={row.id.toString()} label={renderTreeLabel(row, idx)}>
      {row.children.length > 0 ? row.children.map(items => renderTree(items, idx)) : null}
    </TreeItem>
  );

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.tree"]} />

      <PageHeader message="pages.referral.tree.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <ReferralTreeMerchantSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <StyledCopyRefLinkWrapper>
            <StyledTextField
              value={`${refLink}`}
              variant="standard"
              label={formatMessage({ id: "pages.referral.tree.refLink" })}
              inputRef={clipboard.target}
              fullWidth
              InputProps={{
                endAdornment: (
                  <Button onClick={handleCopy}>
                    {!copied ? (
                      <FormattedMessage id="form.buttons.copy" />
                    ) : (
                      <SvgIcon component={Done} width={32} height={32} />
                    )}
                  </Button>
                ),
              }}
            />
          </StyledCopyRefLinkWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledAlert severity="info">
            {referrer === "0x0000000000000000000000000000000000000000" ? (
              <FormattedMessage id="pages.referral.tree.noReferrer" />
            ) : (
              <>
                <FormattedMessage id="pages.referral.tree.current" />: <AddressLink address={referrer} />
              </>
            )}
          </StyledAlert>
        </Grid>
      </Grid>

      <ProgressOverlay isLoading={isLoading}>
        <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
          <Box sx={{ minHeight: 150, flexGrow: 1, mt: 3 }}>
            <SimpleTreeView
              aria-label="referral tree"
              defaultExpandedItems={["root"]}
              slots={{ expandIcon: ChevronRight, collapseIcon: ExpandMore }}
            >
              {rows.map((row, idx) => renderTree(row, idx))}
            </SimpleTreeView>
          </Box>
        </StyledEmptyWrapper>
      </ProgressOverlay>
    </Grid>
  );
};
