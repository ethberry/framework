import { ChangeEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IAssetComponent, IToken } from "@framework/types";
import { TokenType } from "@framework/types";

import { formatTokenTitle } from "../../../utils/token";

export const TokenDepositInput: () => any = () => {
  const deposit: IAssetComponent[] = useWatch({ name: "deposit" });
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue("tokenIds", [option?.id] ?? [0]);
    form.setValue("tokenId", option?.id ?? 0);
    form.setValue("token.tokenId", option?.tokenId ?? 0);
  };

  return deposit.map((dep, i) =>
    dep.tokenType === TokenType.ERC721 ? (
      <EntityInput
        key={i}
        name="tokenId"
        controller="tokens"
        data={{
          contractIds: [dep.contractId],
          templateIds: dep.templateId ? [dep.templateId] : [],
        }}
        getTitle={(token: IToken) => formatTokenTitle(token)}
        onChange={handleChange}
      />
    ) : null,
  );
};
