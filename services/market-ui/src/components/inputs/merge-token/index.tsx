import React, { FC } from "react";
import { Box } from "@mui/material";

import type { IMerge } from "@framework/types";
import { TokenStatus } from "@framework/types";

import { TokenInput } from "./token-input";
import { Root, StyledAssetWrapper } from "./styled";

export interface ITokenMergeInputProps {
  merge: IMerge;
}

export const TokenMergeInput: FC<ITokenMergeInputProps> = props => {
  const { merge } = props;

  return (
    <Root container spacing={2}>
      {new Array(parseInt(merge.price?.components[0].amount || "1")).fill(null).map((_a, i) => (
        <StyledAssetWrapper item xs={12} sm={6} md={3} key={i}>
          <Box flex={1} height="100%">
            <TokenInput
              prefix={`tokens[${i}]`}
              index={i}
              data={{
                contractIds: !merge.price?.components[0]?.templateId
                  ? merge.price?.components?.map(component => component.contractId)
                  : [],
                templateIds: merge.price?.components[0]?.templateId
                  ? merge.price?.components?.map(component => component.templateId)
                  : [],
                tokenStatus: [TokenStatus.MINTED],
              }}
              tokenType={merge.price!.components[0].tokenType}
              readOnly={!!merge.price!.components[0].templateId}
            />
          </Box>
        </StyledAssetWrapper>
      ))}
    </Root>
  );
};
