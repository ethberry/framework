import { FC, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { stringify } from "qs";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApi } from "@gemunion/provider-api";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection, useMetamask } from "@gemunion/react-hooks";
import { IErc1155Recipe, IErc1155RecipeSearchDto } from "@framework/types";
import ERC1155ERC1155Craft from "@framework/binance-contracts/artifacts/contracts/Craft/ERC1155ERC1155Craft.sol/ERC1155ERC1155Craft.json";

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

  const { library, active } = useWeb3React();

  const api = useApi();

  const getApprove = async (): Promise<void> => {
    return api
      .fetchJson({
        url: `/erc1155-token-history/${process.env.ERC1155_RESOURCES_ADDR}/approve`,
      })
      .then((approve: boolean) => {
        setIsApproved(approve);
      });
  };

  const metaApprove = useMetamask(() => {
    const contract = new ethers.Contract(process.env.ERC1155_CRAFT_ADDR, ERC1155ERC1155Craft.abi, library.getSigner());
    return contract.setApprovalForAll(process.env.ERC1155_RESOURCES_ADDR, true).then(() => {
      enqueueSnackbar(formatMessage({ id: "snackbar.approved" }), { variant: "success" });
      setIsApproved(true);
    }) as Promise<void>;
  });

  const handleApprove = () => {
    void metaApprove();
  };

  useEffect(() => {
    void getApprove();
  }, []);

  return (
    <Grid>
      <PageHeader message="pages.craft.title">
        <Button startIcon={<AddTaskIcon />} onClick={handleApprove} disabled={!active || isApproved}>
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
