import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { getPainText } from "@gemunion/draft-js-utils";

import { Erc998CollectionEntity } from "./collection.entity";
import { IOpenSeaMetadata } from "../../common/interfaces";

@Injectable()
export class Erc998CollectionService {
  constructor(
    @InjectRepository(Erc998CollectionEntity)
    private readonly erc998CollectionEntityRepository: Repository<Erc998CollectionEntity>,
    private readonly configService: ConfigService,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc998CollectionEntity>,
    options?: FindOneOptions<Erc998CollectionEntity>,
  ): Promise<Erc998CollectionEntity | null> {
    return this.erc998CollectionEntityRepository.findOne({ where, ...options });
  }

  public async getCollectionMetadata(address: string): Promise<IOpenSeaMetadata> {
    const erc998CollectionEntity = await this.findOne({ address });

    if (!erc998CollectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    return {
      description: getPainText(erc998CollectionEntity.description),
      external_url: `${baseUrl}/erc998/${erc998CollectionEntity.address}`,
      image: erc998CollectionEntity.imageUrl,
      name: erc998CollectionEntity.title,
    };
  }
}
