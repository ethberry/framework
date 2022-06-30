import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { BigNumber } from "ethers";
import { getPainText } from "@gemunion/draft-js-utils";

import { IOpenSeaMetadata } from "../../common/interfaces";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";

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

    const { attributes } = tokenEntity;

    return {
      description: getPainText(tokenEntity.template.description),
      external_url: `${baseUrl}/metadata/${tokenEntity.template.contract.address}/${tokenEntity.id}`,
      image: tokenEntity.template.imageUrl,
      name: tokenEntity.template.title,
      attributes,
    };
  }
}
