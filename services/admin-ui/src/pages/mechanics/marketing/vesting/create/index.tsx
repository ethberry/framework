import React from "react";
import { Grid } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router";
import { Web3ContextType } from "@web3-react/core";

import { FormWrapper } from "@ethberry/mui-form";
import { useApi } from "@ethberry/provider-api-firebase";
import { useAllowance, useMetamask } from "@ethberry/react-hooks-eth";
import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { IVestingBox } from "@framework/types";
import { cleanUpAsset, convertDatabaseAssetToTokenTypeAsset } from "@framework/exchange";

import { emptyValues, validationSchema, VestingBoxForm } from "../box/edit/vesting-box";
import { timeValues } from "../box/edit/vesting-box/constants";
import { Time } from "../box/edit/vesting-box/types";

export const CreateVestingBox = () => {
  const navigate = useNavigate();
  const api = useApi();

  const metaFnWithAllowance = useAllowance(
    (_web3Context: Web3ContextType, values: any, form: UseFormReturn<IVestingBox>) => {
      const {
        content,
        template,
        period,
        growthRate,
        cliff,
        afterCliffBasisPoints,
        imageUrl,
        title,
        description,
        shape,
        startTimestamp,
        duration,
      } = values;

      const preparedValues = {
        content: cleanUpAsset(content),
        price: cleanUpAsset(template?.price),
        title,
        description,
        imageUrl,
        contractId: template?.contractId,
        shape,
        startTimestamp,
        duration: timeValues[duration as Time],
        growthRate,
        period: period || 1,
        cliff: timeValues[cliff as Time],
        afterCliffBasisPoints: afterCliffBasisPoints || 0,
      };

      return api
        .fetchJson({
          url: "/vesting/boxes",
          method: "POST",
          data: preparedValues,
        })
        .then(() => {
          form.reset();
          navigate(-1);
          return null;
        });
    },
  );

  const metaFn = useMetamask((values: IVestingBox, form: any, web3Context: Web3ContextType) => {
    const assets = convertDatabaseAssetToTokenTypeAsset(values.content!.components,);

    return metaFnWithAllowance(
      { contract: values.content!.components[0].template!.contract!.address, assets },
      web3Context,
      values,
      form,
    );
  });

  const handleConfirm = async (values: IVestingBox, form: any) => {
    return metaFn(values, form);
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.boxes", "vesting.create"]} />
      <PageHeader message="pages.vesting.create.title" />
      <FormWrapper initialValues={emptyValues} onSubmit={handleConfirm} validationSchema={validationSchema}>
        <VestingBoxForm />
      </FormWrapper>
    </Grid>
  );
};
