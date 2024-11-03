import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router";

import { useApiCall } from "@ethberry/react-hooks";
import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { IVestingBox } from "@framework/types";

import { Root, StyledContent, StyledHeader, StyledSpinnerBox } from "./styled";
import { useRenderPlot } from "./hooks";
import { VestingBoxPurchaseButton } from "../../../../../components/buttons";
import { CurrentBoxContent } from "./content";

export const VestingBox = () => {
  const { id } = useParams<{ id: string }>();

  const [selected, setSelected] = useState<IVestingBox | null>(null);

  const { plotRef } = useRenderPlot({
    shape: selected?.shape,
    cliff: selected?.cliff,
    duration: selected?.duration,
    period: selected?.period,
    afterCliffBasisPoints: selected?.afterCliffBasisPoints,
    growthRate: selected?.growthRate,
  });

  const { fn: getContractFn, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: `/vesting/boxes/${id}`,
      }),
    { success: false, error: false },
  );

  const getBox = async () => {
    const contract = await getContractFn();
    setSelected(contract);
  };

  useEffect(() => {
    void getBox();
  }, []);

  if (isLoading) {
    return (
      <StyledSpinnerBox>
        <Spinner />
      </StyledSpinnerBox>
    );
  }

  if (!selected) {
    // TODO - add error component
    return <div>Something went wrong!</div>;
  }

  return (
    <Root>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.box"]} data={[{}, {}, selected]} />

      <StyledHeader>
        <PageHeader message="pages.vesting.box.title" data={selected} >
          <VestingBoxPurchaseButton vestingBox={selected} />
        </PageHeader>
      </StyledHeader>

      <StyledContent>
        <Box ref={plotRef} id="function-plot" />

        <CurrentBoxContent selected={selected} />

        <Typography variant="body2" color="textSecondary" component="div">
          <RichTextDisplay data={selected.description} />
        </Typography>
      </StyledContent>
    </Root>
  );
};
