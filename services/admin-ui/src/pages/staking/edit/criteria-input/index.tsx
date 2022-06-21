import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import {
  Erc1155TokenStatus,
  Erc721DropboxStatus,
  Erc721TemplateStatus,
  Erc998DropboxStatus,
  Erc998TemplateStatus,
  TokenType,
} from "@framework/types";

export interface ICriteriaInputProps {
  prefix: string;
  name?: string;
}

export const CriteriaInput: FC<ICriteriaInputProps> = props => {
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
          label={formatMessage({ id: "form.labels.erc721TemplateId" })}
          placeholder={formatMessage({ id: "form.placeholders.erc721TemplateId" })}
          data={{
            erc721CollectionIds: collection === 0 ? [] : [collection],
            templateStatus: [Erc721TemplateStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC721D:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-dropboxes"
          label={formatMessage({ id: "form.labels.erc721DropboxId" })}
          placeholder={formatMessage({ id: "form.placeholders.erc721DropboxId" })}
          data={{
            erc721CollectionIds: collection === 2 ? [] : [collection],
            dropboxStatus: [Erc721DropboxStatus.ACTIVE],
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
            erc998CollectionIds: collection === 0 || collection === 2 ? [] : [collection],
            templateStatus: [Erc998TemplateStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC998D:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc998-dropboxes"
          label={formatMessage({ id: "form.labels.erc998DropboxId" })}
          placeholder={formatMessage({ id: "form.placeholders.erc998DropboxId" })}
          data={{
            erc998CollectionIds: collection === 0 || collection === 2 ? [] : [collection],
            dropboxStatus: [Erc998DropboxStatus.ACTIVE],
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
            erc1155CollectionIds: collection === 0 ? [] : [collection],
            tokenStatus: [Erc1155TokenStatus.ACTIVE],
          }}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
    default:
      return null;
  }
};
