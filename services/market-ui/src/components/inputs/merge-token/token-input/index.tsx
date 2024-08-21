import { ChangeEvent, FC, useState } from "react";
import { Card } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TokenType } from "@gemunion/types-blockchain";
import { IAssetComponent, IToken } from "@framework/types";

import { formatTokenTitle } from "../../../../utils/token";
import { StyledCardActions, StyledCardContent, StyledImage } from "./styled";

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
  const { prefix, tokenType, index, name = "tokenId", data, readOnly, disableClear = false } = props;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const form = useFormContext<any>();

  const assets: IAssetComponent[] = useWatch({ name: "tokenEntities" });
  const asset: IAssetComponent = useWatch({ name: `tokenEntities[${index}]` });

  const { formatMessage } = useIntl();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(`${prefix}.${name}`, option?.id ?? 0, { shouldDirty: true }); // actually id
    form.setValue(`tokenEntities[${index}]`, option ?? null, { shouldDirty: true }); // actually token entity
    form.setValue(`tokenIds[${index}]`, option?.id ? ~~option.id : 0, { shouldDirty: true });
  };

  const handleImageLoading = () => setIsImageLoaded(true);

  switch (tokenType) {
    case TokenType.ERC721:
    case TokenType.ERC998:
    case TokenType.ERC1155:
    case TokenType.NATIVE:
    case TokenType.ERC20:
      return (
        <Card>
          <StyledCardActions>
            <EntityInput
              name={`${prefix}.${name}`}
              controller="tokens"
              data={data}
              disabledOptions={assets}
              label={formatMessage({ id: "form.labels.tokenIds" })}
              placeholder={formatMessage({ id: "form.placeholders.tokenIds" })}
              getTitle={(token: IToken) => formatTokenTitle(token)}
              onChange={handleChange}
              disableClear={readOnly || disableClear}
            />
          </StyledCardActions>
          {asset?.template?.imageUrl ? (
            <StyledCardContent sx={{ display: isImageLoaded ? "block" : "none" }}>
              <StyledImage
                component="img"
                src={asset.template.imageUrl}
                alt={asset.template.title}
                onLoad={handleImageLoading}
              />
            </StyledCardContent>
          ) : null}
        </Card>
      );
    default:
      return null;
  }
};
