import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min, Validate, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin, decorate } from "ts-mixer";

import { AccountDto, AddressDto, ForbidEnumValues, IsBigInt } from "@gemunion/nest-js-validators";
import { type IClaimTemplateRowDto, TokenType } from "@framework/types";

export enum ClaimVariant {
  TOKEN = "token",
  TEMPLATE = "template",
}

const createClaimRowDto = (forbiddenTokens: Array<TokenType>, claimVariant: ClaimVariant) => {
  class DynamicClaimTemplateRowDto
    extends Mixin(AccountDto, AddressDto)
    implements Omit<IClaimTemplateRowDto, "endTimestamp">
  {
    @decorate(
      ApiProperty({
        enum: TokenType,
      }),
    )
    @decorate(Transform(({ value }) => value as TokenType))
    @decorate(Validate(ForbidEnumValues, forbiddenTokens))
    @decorate(IsEnum(TokenType, { message: "badInput" }))
    public tokenType: TokenType;

    @decorate(
      ApiProperty({
        type: String,
      }),
    )
    @decorate(IsInt({ message: "typeMismatch" }))
    @decorate(Min(1, { message: "rangeUnderflow" }))
    @decorate(
      ValidateIf(
        o =>
          claimVariant === ClaimVariant.TEMPLATE &&
          [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.tokenType),
      ),
    )
    public templateId: number;

    @decorate(
      ApiProperty({
        type: String,
      }),
    )
    @decorate(IsInt({ message: "typeMismatch" }))
    @decorate(Min(1, { message: "rangeUnderflow" }))
    @decorate(
      ValidateIf(
        o =>
          claimVariant === ClaimVariant.TOKEN &&
          [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.tokenType),
      ),
    )
    public tokenId: number;

    @decorate(
      ApiProperty({
        type: Number,
      }),
    )
    @decorate(IsBigInt({}, { message: "typeMismatch" }))
    @decorate(ValidateIf(o => [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155].includes(o.tokenType)))
    public amount: string;
  }

  return DynamicClaimTemplateRowDto;
};

export const AllInsteadNativeDto = createClaimRowDto([TokenType.NATIVE], ClaimVariant.TOKEN);
export const AllIncludesCoinDto = createClaimRowDto([TokenType.NATIVE, TokenType.ERC20], ClaimVariant.TEMPLATE);
