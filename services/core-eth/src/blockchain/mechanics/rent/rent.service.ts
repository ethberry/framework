import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { WeiPerEther } from "ethers";

import type { IPaginationDto } from "@gemunion/types-collection";

import { RentEntity } from "./rent.entity";
import { AssetService } from "../../exchange/asset/asset.service";
import { ContractStatus, TokenType } from "@framework/types";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(RentEntity)
    private readonly rentEntityRepository: Repository<RentEntity>,
    protected readonly assetService: AssetService,
    protected readonly contractService: ContractService,
  ) {}

  public async search(dto: IPaginationDto): Promise<[Array<RentEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.rentEntityRepository.createQueryBuilder("rent");

    queryBuilder.leftJoinAndSelect("rent.contract", "contract");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "rent.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<RentEntity>,
    options?: FindOneOptions<RentEntity>,
  ): Promise<RentEntity | null> {
    return this.rentEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<RentEntity>, chainId: number): Promise<RentEntity> {
    const contractEntity = await this.contractService.findOne(
      {
        chainId,
        contractType: TokenType.NATIVE,
        contractStatus: ContractStatus.ACTIVE,
      },
      {
        relations: {
          templates: true,
        },
      },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (!contractEntity.templates.length) {
      throw new NotFoundException("templateNotFound");
    }

    const assetEntity = await this.assetService.create({
      components: [
        {
          tokenType: TokenType.NATIVE,
          contractId: contractEntity.id,
          templateId: contractEntity.templates[0].id,
          amount: WeiPerEther.toString(),
        },
      ],
    });

    Object.assign(dto, {
      price: assetEntity,
    });

    return this.rentEntityRepository.create(dto).save();
  }
}
