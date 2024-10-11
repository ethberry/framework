import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { WeiPerEther } from "ethers";

import type { IPaginationDto } from "@ethberry/types-collection";

import { RentableEntity } from "./rentable.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import { ContractStatus, TokenType } from "@framework/types";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RentableService {
  constructor(
    @InjectRepository(RentableEntity)
    private readonly rentEntityRepository: Repository<RentableEntity>,
    protected readonly assetService: AssetService,
    protected readonly contractService: ContractService,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<RentableEntity>, number]> {
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
    where: FindOptionsWhere<RentableEntity>,
    options?: FindOneOptions<RentableEntity>,
  ): Promise<RentableEntity | null> {
    return this.rentEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<RentableEntity>, chainId: number): Promise<RentableEntity> {
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

    const assetEntity = await this.assetService.create();

    await this.assetService.update(assetEntity, {
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
