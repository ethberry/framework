import { FC, useEffect, useState } from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { useParams } from "react-router";
import { Skeleton } from "@mui/lab";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { emptyStateString } from "@ethberry/draft-js-utils";
import { useApiCall } from "@ethberry/react-hooks";
import { StyledAvatar } from "@framework/styled";
import type { IContract } from "@framework/types";

import { CraftContactPanel } from "../../../mechanics/gaming/recipes/craft/craft-contact-panel";
import { Erc1155TemplateList } from "../template-list";

export const Erc1155Contract: FC = () => {
  const { id } = useParams<{ id: string }>();

  const [selected, setSelected] = useState<IContract>({
    title: "",
    description: emptyStateString,
  } as IContract);

  const { fn: getContractFn, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: `/erc1155/contracts/${id}`,
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
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.contract"]} data={[{}, {}, { title: selected.title }]} />

      <PageHeader message="pages.erc1155.contract.title" data={selected}>
        <CraftContactPanel contract={selected} />
      </PageHeader>

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

      <Erc1155TemplateList embedded />
    </Grid>
  );
};
