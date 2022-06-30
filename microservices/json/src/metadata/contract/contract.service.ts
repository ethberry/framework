import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { getPainText } from "@gemunion/draft-js-utils";

import { IOpenSeaMetadata } from "../../common/interfaces";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@Injectable()
export class MetadataContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly uniContractEntityRepository: Repository<UniContractEntity>,
    private readonly configService: ConfigService,
  ) {}

  public findOne(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<UniContractEntity | null> {
    return this.uniContractEntityRepository.findOne({ where, ...options });
  }

  public async getContractMetadata(address: string): Promise<IOpenSeaMetadata> {
    const uniContractEntity = await this.findOne({ address });

    if (!uniContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    return {
      description: getPainText(uniContractEntity.description),
      external_url: `${baseUrl}/metadata/${uniContractEntity.address}`,
      image: uniContractEntity.imageUrl,
      name: uniContractEntity.title,
    };
  }
}
