import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { UniTemplateStatus, TokenType } from "@framework/types";

export interface IUniTokenInputProps {
  prefix: string;
  name?: string;
}

export const UniTokenInput: FC<IUniTokenInputProps> = props => {
  const { prefix, name = "uniTokenId" } = props;

  const { formatMessage } = useIntl();
  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const collection = useWatch({ name: `${prefix}.collection` });

  switch (tokenType) {
    case TokenType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-templates"
          label={formatMessage({ id: "form.labels.uniTemplateIds" })}
          placeholder={formatMessage({ id: "form.placeholders.uniTemplateIds" })}
          data={{
            uniContractIds: collection === 0 ? [] : [collection],
            templateStatus: [UniTemplateStatus.ACTIVE],
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
            uniContractIds: collection === 0 || collection === 2 ? [] : [collection],
            templateStatus: [UniTemplateStatus.ACTIVE],
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
            uniContractIds: collection === 0 ? [] : [collection],
            tokenStatus: [UniTemplateStatus.ACTIVE],
          }}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
    default:
      return null;
  }
};
