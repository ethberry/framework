import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { getPainText } from "@gemunion/draft-js-utils";

import { Erc721CollectionEntity } from "./collection.entity";
import { IOpenSeaMetadata } from "../../common/interfaces";

@Injectable()
export class Erc721CollectionService {
  constructor(
    @InjectRepository(Erc721CollectionEntity)
    private readonly erc721CollectionEntityRepository: Repository<Erc721CollectionEntity>,
    private readonly configService: ConfigService,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc721CollectionEntity>,
    options?: FindOneOptions<Erc721CollectionEntity>,
  ): Promise<Erc721CollectionEntity | null> {
    return this.erc721CollectionEntityRepository.findOne({ where, ...options });
  }

  public async getCollectionMetadata(address: string): Promise<IOpenSeaMetadata> {
    const erc721CollectionEntity = await this.findOne({ address });

    if (!erc721CollectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    return {
      description: getPainText(erc721CollectionEntity.description),
      external_url: `${baseUrl}/erc721/${erc721CollectionEntity.address}`,
      image: erc721CollectionEntity.imageUrl,
      name: erc721CollectionEntity.title,
    };
  }
}
