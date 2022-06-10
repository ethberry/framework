import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";

import { ItemType } from "../interfaces";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
  related?: string;
}

export const CriteriaInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "criteria", related = "itemType" } = props;

  const { formatMessage } = useIntl();
  const value = useWatch({ name: `${prefix}.${related}` });

  switch (value) {
    case ItemType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-templates"
          label={formatMessage({ id: "form.labels.erc721TemplateId" })}
        />
      );
    case ItemType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc1155-tokens"
          label={formatMessage({ id: "form.labels.erc1155TokenId" })}
          // placeholder={formatMessage({ id: "form.labels.erc1155TokenId" })}
        />
      );
    case ItemType.NATIVE:
    case ItemType.ERC20:
    default:
      return null;
  }
};
