import React, { FC } from "react";
import { Box } from "@mui/material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { IAssetComponent, IMerge } from "@framework/types";

import { sorter } from "../../../utils/sorter";
import { TokenInput } from "./token-input";
import { Root, StyledAssetWrapper } from "./styled";

export interface ITokenMergeInputProps {
  merge: IMerge;
}

export const TokenMergeInput: FC<ITokenMergeInputProps> = props => {
  const { merge } = props;
  const form = useFormContext<any>();

  const { fields } = useFieldArray({ name: "tokens", control: form.control });
  const tokens: IAssetComponent[] = useWatch({ name: "tokens" });
  const assets: IAssetComponent[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...tokens[index],
      }) as IAssetComponent,
  );

  return (
    <Root container spacing={2}>
      {assets.sort(sorter("templateId")).map((asset, index) => (
        <StyledAssetWrapper item xs={12} sm={6} md={3} key={asset.id}>
          <Box flex={1} height="100%">
            <TokenInput
              prefix={`tokens[${index}]`}
              index={index}
              data={{
                contractIds: !merge.price?.components[0]?.templateId
                  ? merge.price?.components?.map(component => component.contractId)
                  : [],
                templateIds: merge.price?.components[0]?.templateId
                  ? merge.price?.components?.map(component => component.templateId)
                  : [],
              }}
              tokenType={asset.tokenType}
              readOnly={!!asset.templateId}
            />
          </Box>
        </StyledAssetWrapper>
      ))}
    </Root>
  );
};
