import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import { PaymentRequiredException } from "@gemunion/nest-js-utils";
import { BusinessType, IContractManagerSearchDto, ModuleType, TokenType } from "@framework/types";

import type { IContractManagerCreateDto } from "./interfaces";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { RatePlanService } from "../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../hierarchy/contract/contract.service";
import { ContractManagerEntity } from "./contract-manager.entity";

@Injectable()
export class ContractManagerService {
  constructor(
    @InjectRepository(ContractManagerEntity)
    private readonly contractManagerEntityRepository: Repository<ContractManagerEntity>,
    private readonly planService: RatePlanService,
    private readonly contractService: ContractService,
    protected readonly configService: ConfigService,
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

  public async validateDeployment(
    userEntity: UserEntity,
    contractModule: ModuleType,
    contractType: TokenType | null,
  ): Promise<void> {
    const limit = await this.planService.getPlanLimits(userEntity, contractModule, contractType);
    const count = await this.contractService.count({
      contractModule,
      contractType: contractType || IsNull(),
      merchantId: userEntity.merchantId,
    });

    const businessType = this.configService.get<BusinessType>("BUSINESS_TYPE", BusinessType.B2B);

    if (businessType === BusinessType.B2B && count >= limit) {
      throw new PaymentRequiredException("paymentRequired");
    }
  }
}
