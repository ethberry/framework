import { FC, useEffect, useState } from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { Skeleton } from "@mui/lab";
import { useParams } from "react-router";

import { StyledAvatar } from "@framework/styled";
import type { IContract } from "@framework/types";
import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { emptyStateString } from "@ethberry/draft-js-utils";
import { useApiCall } from "@ethberry/react-hooks";

import { LootBoxList } from "../box-list";

export const LootContract: FC = () => {
  const { id } = useParams<{ id: string }>();

  const [selected, setSelected] = useState<IContract>({
    title: "",
    description: emptyStateString,
  } as IContract);

  const { fn: getContractFn, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: `/loot/contracts/${id}`,
      }),
    { success: false, error: false },
  );

  const getContract = async () => {
    const contract = await getContractFn();
    setSelected(contract);
  };

  useEffect(() => {
    void getContract();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "loot", "loot.contract"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.loot.contract.title" data={selected} />

      <Box display="flex">
        <Box margin={1}>
          {isLoading ? (
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          ) : (
            <StyledAvatar src={selected.imageUrl} />
          )}
        </Box>
        <Box width="100%">
          {isLoading ? (
            <Skeleton width="100%">
              <Typography>.</Typography>
            </Skeleton>
          ) : (
            <Typography variant="body2" color="textSecondary" component="div">
              <RichTextDisplay data={selected.description} />
            </Typography>
          )}
        </Box>
      </Box>

      <LootBoxList embedded />
    </Grid>
  );
};
