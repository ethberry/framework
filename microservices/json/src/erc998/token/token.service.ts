import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { BigNumber } from "ethers";

import { getPainText } from "@gemunion/draft-js-utils";

import { Erc998TokenEntity } from "./token.entity";
import { IOpenSeaMetadata } from "../../common/interfaces";

@Injectable()
export class Erc998TokenService {
  constructor(
    @InjectRepository(Erc998TokenEntity)
    private readonly erc998TokenEntityRepository: Repository<Erc998TokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  public getToken(address: string, tokenId: string): Promise<Erc998TokenEntity | null> {
    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collection");

    queryBuilder.andWhere("collection.address = :address", {
      address,
    });
    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }

  public async getTokenMetadata(address: string, tokenId: BigNumber): Promise<IOpenSeaMetadata> {
    const erc998TokenEntity = await this.getToken(address, tokenId.toString());

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    const { attributes } = erc998TokenEntity;
    // TODO filter tokenId, templateId, dropboxId
    const attributesArr = Object.entries(attributes).map(([key, value]: [string, any]) => ({
      trait_type: key,
      value,
    }));

    return {
      description: getPainText(erc998TokenEntity.erc998Template.description),
      external_url: `${baseUrl}/erc998/${erc998TokenEntity.erc998Template.erc998Collection.address}/${erc998TokenEntity.id}`,
      image: erc998TokenEntity.erc998Template.imageUrl,
      name: erc998TokenEntity.erc998Template.title,
      attributes: attributesArr,
    };
  }
}
