import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { VestingEntity } from "./vesting.entity";
import { IContractListenerResult } from "../../../common/interfaces";

@Injectable()
export class VestingService {
  constructor(
    @InjectRepository(VestingEntity)
    private readonly vestingEntityRepository: Repository<VestingEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<VestingEntity>,
    options?: FindOneOptions<VestingEntity>,
  ): Promise<VestingEntity | null> {
    return this.vestingEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<VestingEntity>,
    options?: FindOneOptions<VestingEntity>,
  ): Promise<Array<VestingEntity>> {
    return this.vestingEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<VestingEntity>): Promise<VestingEntity> {
    return this.vestingEntityRepository.create(dto).save();
  }

  public async update(where: FindOptionsWhere<VestingEntity>, dto: DeepPartial<VestingEntity>): Promise<VestingEntity> {
    const contractEntity = await this.findOne(where);

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return contractEntity.save();
  }

  public async findAllContracts(): Promise<IContractListenerResult> {
    const queryBuilder = this.vestingEntityRepository.createQueryBuilder("vesting");
    queryBuilder.select(["vesting.account", "vesting.fromBlock"]);

    const contractEntities = await queryBuilder.getMany();
    if (contractEntities.length) {
      return {
        address: contractEntities.map(contractEntity => contractEntity.account),
        fromBlock: Math.max(...contractEntities.map(contractEntity => contractEntity.fromBlock)),
      };
    }
    return { address: [], fromBlock: undefined };
  }

  public async updateLastBlock(lastBlock: number): Promise<number> {
    // TODO make it nice
    const entity = await this.findOne({
      id: 1,
    });

    if (entity) {
      await this.update(
        {
          id: entity.id,
        },
        { fromBlock: lastBlock + 1 },
      );
      return entity.fromBlock;
    }
    return lastBlock;
  }
}
