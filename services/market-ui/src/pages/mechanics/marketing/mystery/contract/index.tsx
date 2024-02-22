import { FC, Fragment, useEffect, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { useParams } from "react-router";
import { Skeleton } from "@mui/lab";

import { StyledAvatar } from "@framework/styled";
import type { IContract } from "@framework/types";
import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useApiCall } from "@gemunion/react-hooks";

import { MysteryBoxList } from "../box-list";

export const MysteryContract: FC = () => {
  const { id } = useParams<{ id: string }>();

  const [selected, setSelected] = useState<IContract>({
    title: "",
    description: emptyStateString,
  } as IContract);

  const { fn: getContractFn, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: `/mystery/contracts/${id}`,
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
    <Fragment>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.contract"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.mystery.contract.title" data={selected} />

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

      <MysteryBoxList embedded />
    </Fragment>
  );
};