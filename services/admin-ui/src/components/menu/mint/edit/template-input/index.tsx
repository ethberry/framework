import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateStatus, TokenType } from "@framework/types";

export const TemplateInput: FC = () => {
  const tokenType = useWatch({ name: "tokenType" });
  const contractId = useWatch({ name: "contractId" });

  if (!contractId) {
    return null;
  }

  switch (tokenType) {
    case TokenType.ERC721:
      return (
        <EntityInput
          name="templateId"
          controller="templates"
          data={{
            contractIds: [contractId],
            templateStatus: [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN],
          }}
        />
      );
    case TokenType.ERC998:
      return (
        <EntityInput
          name="templateId"
          controller="templates"
          data={{
            contractIds: [contractId],
            templateStatus: [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN],
          }}
        />
      );
    case TokenType.ERC1155:
      return (
        <EntityInput
          name="templateId"
          controller="templates"
          data={{
            contractIds: [contractId],
            templateStatus: [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN],
          }}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
    default:
      return null;
  }
};
