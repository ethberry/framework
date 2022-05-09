import { FC, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { stringify } from "qs";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { WalletContext } from "@gemunion/provider-wallet";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ApiContext } from "@gemunion/provider-api";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection } from "@gemunion/react-hooks";
import { IErc1155Recipe, IErc1155RecipeSearchDto } from "@framework/types";
import CraftERC1155 from "@framework/binance-contracts/artifacts/contracts/Craft/CraftERC1155.sol/CraftERC1155.json";

import { CraftTabs, ITabPanelProps } from "../tabs";
import { Erc1155RecipeItem } from "../../erc1155/recipe-list/item";

export const Resources: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== CraftTabs.resources) {
    return null;
  }

  const { rows, count, search, isLoading, handleSubmit, handleChangePage } = useCollection<
    IErc1155Recipe,
    IErc1155RecipeSearchDto
  >({
    baseUrl: "/erc1155-recipes",
    search: {
      query: "",
    },
    redirect: (_baseUrl, search) => `/craft/${value}?${stringify(search)}`,
  });

  const [isApproved, setIsApproved] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const wallet = useContext(WalletContext);
  const { library, active } = useWeb3React();

  const api = useContext(ApiContext);

  const getApprove = async (): Promise<void> => {
    return api
      .fetchJson({
        url: `/erc1155-token-history/${process.env.RESOURCES_ADDR}/approve`,
      })
      .then((approve: boolean) => {
        setIsApproved(approve);
      });
  };

  const approveCraft = () => {
    if (!active) {
      wallet.setWalletConnectDialogOpen(true);
      return;
    }

    const contract = new ethers.Contract(process.env.ERC1155_CRAFT_ADDR, CraftERC1155.abi, library.getSigner());
    void contract
      .setApprovalForAll(process.env.RESOURCES_ADDR, true)
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.approved" }), { variant: "success" });
        setIsApproved(true);
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          enqueueSnackbar(formatMessage({ id: "snackbar.denied" }), { variant: "warning" });
        } else {
          console.error(error);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  useEffect(() => {
    void getApprove();
  }, []);

  return (
    <Grid>
      <PageHeader message="pages.craft.title">
        <Button startIcon={<AddTaskIcon />} onClick={approveCraft} disabled={!active || isApproved}>
          <FormattedMessage id={`form.buttons.${isApproved ? "approved" : "approve"}`} />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSubmit} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(recipe => (
            <Grid item lg={4} sm={6} xs={12} key={recipe.id}>
              <Erc1155RecipeItem recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Grid>
  );
};
