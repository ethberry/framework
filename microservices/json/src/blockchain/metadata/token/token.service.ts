import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";

import { getText } from "@gemunion/draft-js-utils";
import { decodeTraits } from "@gemunion/traits-v6";
import { TokenMetadata, TokenRarity } from "@framework/types";
import type { IOpenSeaTokenMetadata, IOpenSeaMetadataAttribute } from "@framework/types";

import { TokenEntity } from "../../hierarchy/token/token.entity";

@Injectable()
export class MetadataTokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: Repository<TokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  public getToken(address: string, tokenId: string, chainId?: number): Promise<TokenEntity | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    if (chainId && chainId !== 0) {
      queryBuilder.andWhere("contract.chainId = :chainId", { chainId });
    }

    queryBuilder.andWhere("contract.address = :address", { address });
    queryBuilder.andWhere("token.tokenId = :tokenId", { tokenId });

    return queryBuilder.getOne();
  }

  public async getTokenMetadata(address: string, tokenId: bigint, chainId: number): Promise<IOpenSeaTokenMetadata> {
    const tokenEntity = await this.getToken(address, tokenId.toString(), chainId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    const { metadata } = tokenEntity;

    return {
      name: tokenEntity.template.title,
      description: getText(tokenEntity.template.description),
      image: tokenEntity.imageUrl || tokenEntity.template.imageUrl,
      external_url: `${baseUrl}/metadata/${chainId}/${tokenEntity.template.contract.address}/${tokenEntity.tokenId}`,
      attributes: this.formatMetadata(metadata),
    };
  }

  public formatMetadata(metadata: Record<string, string>): Array<IOpenSeaMetadataAttribute> {
    return Object.entries(metadata).reduce((memo, [key, value]) => {
      switch (key as TokenMetadata) {
        case TokenMetadata.RARITY:
          memo.push({
            trait_type: key,
            value: Object.values(TokenRarity)[~~value],
          });
          break;
        // MODULE:DND
        // MODULE:BREEDING
        // MODULE:COLLECTION
        case TokenMetadata.TRAITS:
          Object.entries(decodeTraits(BigInt(value))).forEach(([key, value]) => {
            memo.push({
              trait_type: key,
              value,
            });
          });
          break;
        case TokenMetadata.TEMPLATE_ID:
          break;
        // custom metadata
        default:
          memo.push({
            trait_type: key,
            value,
          });
          break;
      }

      return memo;
    }, [] as Array<IOpenSeaMetadataAttribute>);
  }
}
