import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TokenType, TemplateStatus } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
}

export const TokenInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "tokenId" } = props;

  const { formatMessage } = useIntl();
  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const collection = useWatch({ name: `${prefix}.collection` });

  switch (tokenType) {
    case TokenType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-templates"
          label={formatMessage({ id: "form.labels.templateIds" })}
          placeholder={formatMessage({ id: "form.placeholders.templateIds" })}
          data={{
            contractIds: collection === 0 ? [] : [collection],
            templateStatus: [TemplateStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC998:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-templates"
          label={formatMessage({ id: "form.labels.erc998TemplateId" })}
          placeholder={formatMessage({ id: "form.placeholders.erc998TemplateId" })}
          data={{
            contractIds: collection === 0 || collection === 2 ? [] : [collection],
            templateStatus: [TemplateStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc1155-tokens"
          label={formatMessage({ id: "form.labels.erc1155TokenId" })}
          placeholder={formatMessage({ id: "form.placeholders.erc1155TokenId" })}
          data={{
            contractIds: collection === 0 ? [] : [collection],
            tokenStatus: [TemplateStatus.ACTIVE],
          }}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
    default:
      return null;
  }
};
