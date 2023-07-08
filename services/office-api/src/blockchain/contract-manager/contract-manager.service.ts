import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IContractManagerSearchDto } from "@framework/types";

import { IContractManagerCreateDto } from "./interfaces";
import { ContractManagerEntity } from "./contract-manager.entity";
import { AST } from "eslint";

@Injectable()
export class ContractManagerService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    @InjectRepository(ContractManagerEntity)
    private readonly contractManagerEntityRepository: Repository<ContractManagerEntity>,
  ) {}

  public async search(dto: Partial<IContractManagerSearchDto>): Promise<[Array<ContractManagerEntity>, number]> {
    const { skip, take, query, contractType } = dto;

    const queryBuilder = this.contractManagerEntityRepository.createQueryBuilder("manager");

    queryBuilder.select();

    if (query) {
      queryBuilder.andWhere("manager.address ILIKE '%' || :address || '%'", { address: query });
    }

    if (contractType) {
      if (contractType.length === 1) {
        queryBuilder.andWhere("manager.contractType = :contractType", {
          contractType: contractType[0],
        });
      } else {
        queryBuilder.andWhere("manager.contractType IN(:...contractType)", { contractType });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "manager.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ContractManagerEntity>,
    options?: FindOneOptions<ContractManagerEntity>,
  ): Promise<ContractManagerEntity | null> {
    return this.contractManagerEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IContractManagerCreateDto): Promise<ContractManagerEntity | null> {
    const { address, fromBlock, contractType } = dto;

    return this.contractManagerEntityRepository.create({ address, fromBlock, contractType }).save();
  }

  public async delete(where: FindOptionsWhere<ContractManagerEntity>): Promise<DeleteResult> {
    return this.contractManagerEntityRepository.delete(where);
  }

  public async update(
    where: FindOptionsWhere<ContractManagerEntity>,
    dto: Partial<IContractManagerCreateDto>,
  ): Promise<ContractManagerEntity> {
    const contractManagerEntity = await this.findOne(where);

    if (!contractManagerEntity) {
      throw new NotFoundException("entityNotFound");
    }

    Object.assign(contractManagerEntity, { dto });

    return contractManagerEntity.save();
  }

  // public async validateDeployment(
  //   userEntity: UserEntity,
  //   contractModule: ModuleType,
  //   contractType: TokenType | null,
  // ): Promise<void> {
  //   const limit = await this.planService.getPlanLimits(userEntity, contractModule, contractType);
  //
  //   const count = await this.contractService.count({
  //     contractModule,
  //     contractType: contractType || IsNull(),
  //   });
  //
  //   if (count >= limit) {
  //     throw new ForbiddenException("rateLimitExceeded");
  //   }
  // }
}
