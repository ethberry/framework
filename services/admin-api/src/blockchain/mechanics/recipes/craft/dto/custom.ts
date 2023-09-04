import { TokenType } from "@framework/types";
import { createCustomAssetDto } from "../../../../exchange/asset/dto/custom";

export const CraftItemDto = createCustomAssetDto([TokenType.NATIVE]);
export const CraftPriceDto = createCustomAssetDto([TokenType.ERC721, TokenType.ERC998]);
