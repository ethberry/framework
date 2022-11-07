import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { VestingEntity } from "./vesting.entity";
import { IContractListenerResult } from "../../../common/interfaces";

@Injectable()
export class VestingService {
  public chainId: number;

  constructor(
    @InjectRepository(VestingEntity)
    private readonly vestingEntityRepository: Repository<VestingEntity>,
    private readonly configService: ConfigService,
  ) {
    this.chainId = ~~configService.get<string>("CHAIN_ID", "1337");
  }

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

  // TODO use ContractService instead
  public async findAllContracts(): Promise<IContractListenerResult> {
    const queryBuilder = this.vestingEntityRepository.createQueryBuilder("vesting");
    queryBuilder.select(["vesting.address", "vesting.fromBlock"]);

    const contractEntities = await queryBuilder.getMany();
    if (contractEntities.length) {
      return {
        address: contractEntities.map(contractEntity => contractEntity.address),
        fromBlock: Math.max(...contractEntities.map(contractEntity => contractEntity.fromBlock)),
      };
    }
    return { address: [], fromBlock: undefined };
  }

  public async updateLastBlockByAddr(address: string, lastBlock: number): Promise<number> {
    const vestingEntity = await this.findOne({
      address,
      chainId: this.chainId,
    });

    if (vestingEntity) {
      await this.update(
        {
          id: vestingEntity.id,
        },
        { fromBlock: lastBlock + 1 },
      );
      return vestingEntity.fromBlock;
    }
    return lastBlock;
  }
}
