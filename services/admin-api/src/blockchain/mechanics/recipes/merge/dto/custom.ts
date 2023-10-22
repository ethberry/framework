import { TokenType } from "@framework/types";

import { createCustomAssetDto } from "../../../../exchange/asset/dto/custom";

export const MergePriceDto = createCustomAssetDto([TokenType.ERC721, TokenType.ERC998]);

export const MergeItemDto = createCustomAssetDto([TokenType.ERC721, TokenType.ERC998]);
