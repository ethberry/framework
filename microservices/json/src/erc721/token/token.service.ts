import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { BigNumber } from "ethers";

import { getPainText } from "@gemunion/draft-js-utils";

import { Erc721TokenEntity } from "./token.entity";
import { IOpenSeaMetadata } from "../../common/interfaces";

@Injectable()
export class Erc721TokenService {
  constructor(
    @InjectRepository(Erc721TokenEntity)
    private readonly erc721TokenEntityRepository: Repository<Erc721TokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  public getToken(address: string, tokenId: string): Promise<Erc721TokenEntity | null> {
    const queryBuilder = this.erc721TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc721Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc721Collection", "collection");

    queryBuilder.andWhere("collection.address = :address", {
      address,
    });
    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }

  public async getTokenMetadata(address: string, tokenId: BigNumber): Promise<IOpenSeaMetadata> {
    const erc721TokenEntity = await this.getToken(address, tokenId.toString());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    const { attributes } = erc721TokenEntity;
    // TODO filter tokenId, templateId, dropboxId
    const attributesArr = Object.entries(attributes).map(([key, value]: [string, any]) => ({
      trait_type: key,
      value,
    }));

    return {
      description: getPainText(erc721TokenEntity.erc721Template.description),
      external_url: `${baseUrl}/erc721/${erc721TokenEntity.erc721Template.erc721Collection.address}/${erc721TokenEntity.id}`,
      image: erc721TokenEntity.erc721Template.imageUrl,
      name: erc721TokenEntity.erc721Template.title,
      attributes: attributesArr,
    };
  }
}
