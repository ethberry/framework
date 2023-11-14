import { FC } from "react";
import { Box } from "@mui/material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { IAssetComponent } from "@framework/types";

import { TokenInput } from "./token-input";

export const TokenDepositInput: FC = () => {
  const form = useFormContext<any>();

  const { fields } = useFieldArray({ name: "deposit", control: form.control });
  const deposits: IAssetComponent[] = useWatch({ name: "deposit" });
  const assets: IAssetComponent[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...deposits[index],
      }) as IAssetComponent,
  );

  return (
    <Box>
      {assets.map((asset, index) => (
        <TokenInput
          key={asset.id}
          prefix={`tokens[${index}]`}
          index={index}
          data={{
            contractIds: [asset.contractId],
            templateIds: asset.templateId ? [asset.templateId] : [],
          }}
          tokenType={asset.tokenType}
          readOnly={!!asset.templateId}
        />
      ))}
    </Box>
  );
};
