import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateStatus, TokenType } from "@framework/types";

export const TemplateInput: FC = () => {
  const tokenType = useWatch({ name: "tokenType" });
  const contractId = useWatch({ name: "contractId" });

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("tokenId", option?.tokens[0].id ?? 0);
  };

  if (!contractId) {
    return null;
  }

  switch (tokenType) {
    case TokenType.ERC721:
    case TokenType.ERC998:
      return (
        <EntityInput
          name="templateId"
          controller="templates"
          data={{
            contractIds: [contractId],
            templateStatus: [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN],
          }}
          onChange={handleChange}
        />
      );
    case TokenType.ERC1155:
      return (
        <EntityInput
          name="tokenId"
          controller="templates"
          data={{
            contractIds: [contractId],
            templateStatus: [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN],
          }}
          // getTitle={(tem: IToken) => `${token.template!.title} #${token.tokenId}`}
          onChange={handleChange}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
    default:
      return null;
  }
};
