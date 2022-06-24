import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { getPainText } from "@gemunion/draft-js-utils";

import { Erc1155CollectionEntity } from "./collection.entity";
import { IOpenSeaMetadata } from "../../common/interfaces";

@Injectable()
export class Erc1155CollectionService {
  constructor(
    @InjectRepository(Erc1155CollectionEntity)
    private readonly erc1155CollectionEntityRepository: Repository<Erc1155CollectionEntity>,
    private readonly configService: ConfigService,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc1155CollectionEntity>,
    options?: FindOneOptions<Erc1155CollectionEntity>,
  ): Promise<Erc1155CollectionEntity | null> {
    return this.erc1155CollectionEntityRepository.findOne({ where, ...options });
  }

  public async getCollectionMetadata(address: string): Promise<IOpenSeaMetadata> {
    const erc1155CollectionEntity = await this.findOne({ address });

    if (!erc1155CollectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    return {
      description: getPainText(erc1155CollectionEntity.description),
      external_url: `${baseUrl}/erc1155/${erc1155CollectionEntity.address}`,
      image: erc1155CollectionEntity.imageUrl,
      name: erc1155CollectionEntity.title,
    };
  }
}
