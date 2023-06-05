import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { BigNumber } from "ethers";

import { getText } from "@gemunion/draft-js-utils";
import { TokenMetadata, TokenRarity } from "@framework/types";
import { decodeTraits } from "@framework/traits";

import { IOpenSeaMetadata, IOpenSeaMetadataAttribute } from "../../../common/interfaces";
import { TokenEntity } from "../../hierarchy/token/token.entity";

@Injectable()
export class MetadataTokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: Repository<TokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  public getToken(address: string, tokenId: string): Promise<TokenEntity | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.andWhere("contract.address = :address", {
      address,
    });
    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }

  public async getTokenMetadata(address: string, tokenId: BigNumber): Promise<IOpenSeaMetadata> {
    const tokenEntity = await this.getToken(address, tokenId.toString());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    const { metadata } = tokenEntity;

    return {
      description: getText(tokenEntity.template.description),
      external_url: `${baseUrl}/metadata/${tokenEntity.template.contract.address}/${tokenEntity.tokenId}`,
      image: tokenEntity.template.imageUrl,
      name: tokenEntity.template.title,
      attributes: this.formatMetadata(metadata),
    };
  }

  public formatMetadata(metadata: Record<string, string>): Array<IOpenSeaMetadataAttribute> {
    return Object.entries(metadata).reduce((memo, [key, value]) => {
      switch (key) {
        case TokenMetadata.RARITY:
          memo.push({
            trait_type: key,
            value: Object.values(TokenRarity)[~~value],
          });
          break;
        case TokenMetadata.GRADE:
          memo.push({
            trait_type: key,
            value,
          });
          break;
        // MODULE:DND
        // MODULE:BREEDING
        // MODULE:COLLECTION
        case TokenMetadata.TRAITS:
          Object.entries(decodeTraits(BigNumber.from(value))).forEach(([key, value]) => {
            memo.push({
              trait_type: key,
              value,
            });
          });
          break;
        case TokenMetadata.TEMPLATE_ID:
        default:
          break;
      }

      return memo;
    }, [] as Array<IOpenSeaMetadataAttribute>);
  }
}
