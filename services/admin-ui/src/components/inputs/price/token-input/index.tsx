import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateStatus, TokenType } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
}

export const TokenInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "tokenId" } = props;

  const { formatMessage } = useIntl();
  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const contractId = useWatch({ name: `${prefix}.contractId` });

  if (!contractId) {
    return null;
  }

  switch (tokenType) {
    case TokenType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="templates"
          label={formatMessage({ id: "form.labels.templateIds" })}
          placeholder={formatMessage({ id: "form.placeholders.templateIds" })}
          data={{
            contractIds: [contractId],
            templateStatus: [TemplateStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC998:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="templates"
          label={formatMessage({ id: "form.labels.templateIds" })}
          placeholder={formatMessage({ id: "form.placeholders.templateIds" })}
          data={{
            contractIds: [contractId],
            templateStatus: [TemplateStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="templates"
          label={formatMessage({ id: "form.labels.templateIds" })}
          placeholder={formatMessage({ id: "form.placeholders.templateIds" })}
          data={{
            contractIds: [contractId],
            templateStatus: [TemplateStatus.ACTIVE],
          }}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
    default:
      return null;
  }
};
