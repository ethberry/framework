import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TokenType } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
  related?: string;
}

export const CriteriaInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "criteria", related = "tokenType" } = props;

  const { formatMessage } = useIntl();
  const value = useWatch({ name: `${prefix}.${related}` });

  switch (value) {
    case TokenType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-templates"
          label={formatMessage({ id: "form.labels.erc721TemplateId" })}
          placeholder={formatMessage({ id: "form.placeholders.erc721TemplateId" })}
        />
      );
    case TokenType.ERC998:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-templates"
          label={formatMessage({ id: "form.labels.erc998TemplateId" })}
          placeholder={formatMessage({ id: "form.placeholders.erc998TemplateId" })}
        />
      );
    case TokenType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc1155-tokens"
          label={formatMessage({ id: "form.labels.erc1155TokenId" })}
          placeholder={formatMessage({ id: "form.placeholders.erc1155TokenId" })}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
    default:
      return null;
  }
};
