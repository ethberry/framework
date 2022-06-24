import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { BigNumber } from "ethers";
import { getPainText } from "@gemunion/draft-js-utils";

import { Erc1155TokenEntity } from "./token.entity";
import { IOpenSeaMetadata } from "../../common/interfaces";

@Injectable()
export class Erc1155TokenService {
  constructor(
    @InjectRepository(Erc1155TokenEntity)
    private readonly erc1155TokenEntityRepository: Repository<Erc1155TokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  public getToken(address: string, tokenId: string): Promise<Erc1155TokenEntity | null> {
    const queryBuilder = this.erc1155TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "collection");

    queryBuilder.andWhere("collection.address = :address", {
      address,
    });
    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }

  public async getTokenMetadata(address: string, tokenId: BigNumber): Promise<IOpenSeaMetadata> {
    const erc1155TokenEntity = await this.getToken(address, tokenId.toString());

    if (!erc1155TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    const { attributes } = erc1155TokenEntity;

    return {
      description: getPainText(erc1155TokenEntity.description),
      external_url: `${baseUrl}/erc1155/${erc1155TokenEntity.erc1155Collection.address}/${erc1155TokenEntity.id}`,
      image: erc1155TokenEntity.imageUrl,
      name: erc1155TokenEntity.title,
      attributes,
    };
  }
}
