import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Alert, Box, Typography } from "@mui/material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { IAssetComponent } from "@framework/types";

import { TokenInput } from "./token-input";
import { sorter } from "../../../utils/sorter";
import { formatItem } from "@framework/exchange";

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
    <Fragment>
      <Alert severity="info">
        <FormattedMessage id="alert.deposit" />
      </Alert>
      <Box>
        {assets.sort(sorter("templateId")).map((asset, index) => (
          <Fragment key={asset.id}>
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
            <Box mt={1} sx={{ textAlign: "left" }}>
              <Typography>{formatItem({ components: [asset] })}</Typography>
            </Box>
          </Fragment>
        ))}
      </Box>
    </Fragment>
  );
};
