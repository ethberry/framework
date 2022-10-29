import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { getText } from "@gemunion/draft-js-utils";

import { IOpenSeaMetadata } from "../../common/interfaces";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Injectable()
export class MetadataContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
    private readonly configService: ConfigService,
  ) {}

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.contractEntityRepository.findOne({ where, ...options });
  }

  public async getContractMetadata(address: string): Promise<IOpenSeaMetadata> {
    const contractEntity = await this.findOne({ address });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    return {
      description: getText(contractEntity.description),
      external_url: `${baseUrl}/metadata/${contractEntity.address}`,
      image: contractEntity.imageUrl,
      name: contractEntity.title,
    };
  }
}
