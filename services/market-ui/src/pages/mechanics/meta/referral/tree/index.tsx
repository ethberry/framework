import { FC, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Box, Grid, SvgIcon, Typography } from "@mui/material";
import { Done, ExpandMore, ChevronRight } from "@mui/icons-material";

import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { TreeView, TreeItem } from "@mui/x-tree-view";
// import { useUser } from "@gemunion/provider-user";
import { useWeb3React } from "@web3-react/core";
import { useClipboard } from "use-clipboard-copy";

import type { IReferralReportSearchDto } from "@framework/types";
import { AddressLink } from "@gemunion/mui-scanner";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useWallet } from "@gemunion/provider-wallet";
import { useCollection } from "@gemunion/react-hooks";

import { StyledCopyRefLinkWrapper, StyledTextField } from "./styled";

export interface IReferralTreeSearchDto extends IReferralReportSearchDto {
  merchantIds: Array<number>;
}

export interface IReferralTreeChain {
  id: number;
  merchant: string;
  wallet: string;
  reflen: number;
  share: number;
}

export interface IRenderTree {
  id: string;
  name: string; // wallet
  share: string;
  level: number;
  merchant?: string;
  children?: readonly IRenderTree[];
}

export const ReferralTree: FC = () => {
  const {
    count,
    rows,
    search,
    isLoading,
    // isFiltersOpen,
    // handleToggleFilters,
    // handleSearch,
    handleChangePaginationModel,
  } = useCollection<IReferralTreeChain, IReferralTreeSearchDto>({
    baseUrl: "/referral/tree",
    search: {
      merchantIds: [], // search by all merchants
    },
  });

  const clipboard = useClipboard();
  const { formatMessage } = useIntl();
  const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();
  const { isActive, account = "" } = useWeb3React();

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    clipboard.copy();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  // prettier-ignore
  // TODO make it nice
  const columns = [
    // {
    //   field: "id",
    //   headerName: formatMessage({ id: "form.labels.id" }),
    //   sortable: true,
    //   flex: 0.05
    // },
    {
      field: "merchant",
      headerName: formatMessage({ id: "form.labels.merchant" }),
      sortable: true,
      flex: 1,
      // minWidth: 100
    },
    {
      field: "wallet",
      headerName: formatMessage({ id: "form.labels.wallet" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} />
        );
      },
      flex: 1.5,
      minWidth: 150
    },
    {
      field: "reflen",
      headerName: formatMessage({ id: "form.labels.level" }),
      sortable: true,
      flex: 0.3,
    },
    {
      field: "share",
      headerName: formatMessage({ id: "form.labels.share" }),
      sortable: true,
      flex: 0.5,
      minWidth: 50
    },
  ];

  useEffect(() => {
    if (!isActive) {
      void openConnectWalletDialog();
    } else {
      void closeConnectWalletDialog();
    }
  }, [isActive]);

  // {
  //   "id": 10,
  //   "merchant": "GEMUNION",
  //   "wallet": "0xf17f52151ebef6c7334fad080c5704d77216b732",
  //   "reflen": 1,
  //   "share": 500
  // }
  // const { profile } = useUser<IUser>();
  // const allTrees = [];
  // if (rows.length > 0) {
  //   const merchants = [...new Set(rows.map(row => row.merchant))];
  //   console.log("merchants", merchants);
  //   for (const merchant of merchants) {
  //     const merchantRows = rows.filter(row => row.merchant === merchant);
  //     console.log("merchantRows", merchantRows);
  //     allTrees.push([
  //       {
  //         id: allTrees.length,
  //         name: profile.wallet,
  //         share: "",
  //         level: 0,
  //         merchant,
  //       },
  //     ]);
  //     console.log("allTrees0", allTrees);
  //     const merchantTree = merchantRows.map(mrow => ({
  //       id: mrow.id,
  //       name: mrow.wallet,
  //       share: `${mrow.share / 100}%`,
  //       level: mrow.reflen,
  //       merchant: mrow.merchant,
  //     }));
  //     console.log("merchantTree", merchantTree);
  //     if (merchantTree.length > 0) {
  //       allTrees[allTrees.length - 1].concat(merchantTree);
  //     }
  //     console.log("allTrees1", allTrees);
  //   }
  // }
  // console.log("allTrees", allTrees);

  // CREATE TREE DATA
  const treeData: IRenderTree = {
    id: "root",
    name: "Referral Tree",
    level: 0,
    share: "",
    merchant: "GEMUNION",
    children: [
      {
        id: "1",
        name: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        level: 1,
        share: "5%",
      },
      {
        id: "2",
        name: "0xebc4dda28eb070c7cab9b62a8c5d84da7fa9cefd",
        level: 1,
        share: "5%",
        children: [
          {
            id: "3",
            name: "0xb53e364dd5d5f1da81e45be0f0b86cc99b57c96a",
            level: 2,
            share: "3%",
          },
          {
            id: "4",
            name: "0xba9b259fb6da3d0adaf14cdd8dfe8e1eb3a2bff0",
            level: 2,
            share: "3%",
            children: [
              {
                id: "5",
                name: "0x6e2a836ae29bdd2d3baad1cbbaa3a3e3e7b5cbff",
                level: 3,
                share: "2%",
              },
              {
                id: "6",
                name: "0x3a4ff49d7a6dba79a71834caddd1cbdbbdacc97a",
                level: 3,
                share: "2%",
              },
            ],
          },
        ],
      },
    ],
  };

  const renderTreeLabel = (wallet: string, level: number, share?: string) => (
    // <Grid container spacing={2}>
    //   <Grid item lg={4} sm={6} xs={12} key={nodes.id}>
    //     <Typography>{`${nodes.name}-${nodes.share || nodes.merchant}`}</Typography>
    //   </Grid>
    // </Grid>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 0.5,
        pr: 0,
      }}
    >
      {/* <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} /> */}
      <Typography variant="body2" sx={{ fontWeight: "inherit", flexGrow: 1 }}>
        <AddressLink address={wallet} />
      </Typography>
      {share ? (
        <Typography variant="caption" color="inherit" sx={{ fontWeight: "inherit" }}>
          {`share: ${share} (level ${level})`}
        </Typography>
      ) : null}
      {/* <Typography variant="caption" color="inherit" sx={{ fontWeight: "inherit", flexGrow: 1 }}> */}
      {/*  {`Level ${level}`} */}
      {/* </Typography> */}
    </Box>
  );

  const renderTree = (nodes: IRenderTree) => (
    // <TreeItem key={nodes.id} nodeId={nodes.id} label={`${nodes.name}-${nodes.share || nodes.merchant}`}>
    <TreeItem key={nodes.id} nodeId={nodes.id} label={renderTreeLabel(nodes.name, nodes.level, nodes.share)}>
      {/* <Grid container spacing={2}> */}
      {/*  <Grid item lg={4} sm={6} xs={12} key={1}> */}
      {/*    <Typography>{nodes.share}</Typography> */}
      {/*  </Grid> */}
      {/* </Grid> */}
      {Array.isArray(nodes.children) ? nodes.children.map(node => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.tree"]} />

      <PageHeader message="pages.referral.tree.title"></PageHeader>

      <StyledCopyRefLinkWrapper>
        <StyledTextField
          value={`${process.env.MARKET_FE_URL}/?referrer=${account.toLowerCase()}`}
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

      {rows.length > 0 ? (
        <DataGrid
          pagination
          paginationMode="server"
          rowCount={count}
          paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
          onPaginationModelChange={handleChangePaginationModel}
          pageSizeOptions={[5, 10, 25, 100]}
          loading={isLoading}
          columns={columns}
          rows={rows.map((tree: IReferralTreeChain, idx) => ({
            id: idx,
            merchant: tree.merchant,
            wallet: tree.wallet,
            share: `${tree.share / 100}%`,
            reflen: tree.reflen,
          }))}
          autoHeight
        />
      ) : null}
      {/* <Box sx={{ minHeight: 110, flexGrow: 1, maxWidth: 300 }}> */}
      {/* </Box> */}
      <Box sx={{ minHeight: 110, flexGrow: 1 }}>
        <TreeView
          aria-label="referral tree"
          defaultCollapseIcon={<ExpandMore />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRight />}
        >
          {renderTree(treeData)}
        </TreeView>
      </Box>
    </Grid>
  );
};
