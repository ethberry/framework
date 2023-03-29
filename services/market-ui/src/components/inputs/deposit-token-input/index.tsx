import { ChangeEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IAssetComponent, IToken } from "@framework/types";
import { TokenType } from "@framework/types";

export const TokenDepositInput: () => any = () => {
  const deposit: IAssetComponent[] = useWatch({ name: "deposit" });
  // const contractId: number = useWatch({ name: "contractId" });
  // const templateId: number = useWatch({ name: "templateId" });
  // console.log("contractId", contractId);
  // console.log("templateId", templateId);
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    // console.log("option.id", option.id ? option.id : "none");
    // console.log("option.tokenId", option.tokenId ? option.tokenId : "none");
    form.setValue("tokenIds", [option?.id] ?? [0]);
    form.setValue("tokenId", option?.id ?? 0);
    form.setValue("token.tokenId", option?.tokenId ?? 0);
  };
  // {deposit.map((dep, i) => (dep.tokenType === TokenType.ERC721 ? <TokenDepositInput key={i} /> : null))}

  //   if (!contractId) {
  //     return null;
  //   }

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
        getTitle={(token: IToken) => `${token.template!.title} #${token.tokenId}`}
        onChange={handleChange}
      />
    ) : null,
  );
};
