import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IToken } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
}

export const TokenInput: FC<ITokenInputProps> = props => {
  const { prefix } = props;
  const { formatMessage } = useIntl();

  const templateId: number = useWatch({ name: `${prefix}.templateId` });

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue(`${prefix}.tokenId`, option?.id ?? 0);
    form.setValue(`${prefix}.blockchainId`, option?.tokenId ?? 0);
  };

  if (!templateId) {
    return null;
  }

  return (
    <EntityInput
      name={`${prefix}.tokenId`}
      controller="tokens"
      data={{
        templateIds: templateId ? [templateId] : [],
      }}
      label={formatMessage({ id: "form.labels.tokenId" })}
      placeholder={formatMessage({ id: "form.placeholders.tokenId" })}
      getTitle={(token: IToken) => `${token.template!.title} #${token.tokenId}`}
      onChange={handleChange}
    />
  );
};
