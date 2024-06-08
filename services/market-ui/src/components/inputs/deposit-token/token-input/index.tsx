import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TokenType } from "@gemunion/types-blockchain";
import type { IToken } from "@framework/types";

import { formatTokenTitle } from "../../../../utils/token";

export interface ITokenInputProps {
  prefix: string;
  tokenType: TokenType;
  name?: string;
  readOnly?: boolean;
  disableClear?: boolean;
  index: number;
  data?: {
    tokenStatus?: Array<string>;
    [k: string]: any;
  };
}

export const TokenInput: FC<ITokenInputProps> = props => {
  const { prefix, tokenType, index, name = "tokenId", data, readOnly, disableClear = true } = props;
  const form = useFormContext<any>();

  const { formatMessage } = useIntl();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(`${prefix}.tokenId`, option?.id ?? 0, { shouldDirty: true }); // actually id
    form.setValue(`tokenIds[${index}]`, option?.tokenId ? ~~option.tokenId : 0, { shouldDirty: true });
  };

  switch (tokenType) {
    case TokenType.ERC721:
    case TokenType.ERC998:
    case TokenType.ERC1155:
    case TokenType.NATIVE:
    case TokenType.ERC20:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="tokens"
          data={{
            ...data,
          }}
          label={formatMessage({ id: "form.labels.tokenIds" })}
          placeholder={formatMessage({ id: "form.placeholders.tokenIds" })}
          getTitle={(token: IToken) => formatTokenTitle(token)}
          // readOnly={readOnly}
          onChange={handleChange}
          autoselect
          disableClear={readOnly || disableClear}
        />
      );
    default:
      return null;
  }
};
