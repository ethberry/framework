import { TokenType } from "@framework/types";
import { createCustomAssetDto } from "../../../../exchange/asset/dto/custom";

export const DismantlePriceDto = createCustomAssetDto([TokenType.NATIVE, TokenType.ERC20]);

export const DismantleItemDto = createCustomAssetDto([TokenType.NATIVE]);
