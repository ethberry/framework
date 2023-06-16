import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IToken } from "@framework/types";

import { formatTokenTitle } from "../../../utils/token";

export const TokenInput: FC = () => {
  const contractId: number = useWatch({ name: "contractId" });
  const templateId: number = useWatch({ name: "templateId" });

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("tokenId", option?.id ?? 0);
    form.setValue("token.tokenId", option?.tokenId ?? 0);
  };

  if (!contractId) {
    return null;
  }

  return (
    <EntityInput
      name="tokenId"
      controller="tokens"
      data={{
        contractIds: [contractId],
        templateIds: templateId ? [templateId] : [],
      }}
      getTitle={(token: IToken) => formatTokenTitle(token)}
      onChange={handleChange}
    />
  );
};
