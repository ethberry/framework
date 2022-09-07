import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IToken, TokenType } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
  readOnly?: boolean;
}

export const TokenInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "tokenId", readOnly } = props;

  const { formatMessage } = useIntl();
  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const contractId = useWatch({ name: `${prefix}.contractId` });

  if (!contractId) {
    return null;
  }

  switch (tokenType) {
    case TokenType.ERC721:
    case TokenType.ERC998:
    case TokenType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="tokens"
          label={formatMessage({ id: "form.labels.tokenIds" })}
          placeholder={formatMessage({ id: "form.placeholders.tokenIds" })}
          data={{
            contractIds: [contractId],
          }}
          getTitle={(token: IToken) => `${token.template!.title} #${token.tokenId}`}
          readOnly={readOnly}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
    default:
      return null;
  }
};
