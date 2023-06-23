import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPaginationDto } from "@gemunion/types-collection";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { AssetService } from "../../exchange/asset/asset.service";
import { IGradeCreateDto, IGradeUpdateDto } from "./interfaces";
import { GradeEntity } from "./grade.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TokenService } from "../../hierarchy/token/token.service";

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeEntityRepository: Repository<GradeEntity>,
    protected readonly assetService: AssetService,
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
  ) {}

  public async search(dto: IPaginationDto, userEntity: UserEntity): Promise<[Array<GradeEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.gradeEntityRepository.createQueryBuilder("grade");

    queryBuilder.leftJoinAndSelect("grade.contract", "contract");

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "grade.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<GradeEntity>,
    options?: FindOneOptions<GradeEntity>,
  ): Promise<GradeEntity | null> {
    return this.gradeEntityRepository.findOne({ where, ...options });
  }

  public async createGrade(dto: IGradeCreateDto, userEntity: UserEntity): Promise<GradeEntity> {
    const { contractId, /* attribute, */ price } = dto;

    const contractEntity = await this.contractService.findOne({
      id: contractId,
    });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const assetEntity = await this.assetService.create({
      components: [],
    });

    await this.assetService.update(assetEntity, price);

    const gradeEntity = await this.create({
      ...dto,
      price: assetEntity,
    });

    // await this.tokenService.updateAttributes(contractId, attribute, "0");

    return gradeEntity;
  }

  public async create(dto: DeepPartial<TemplateEntity>): Promise<GradeEntity> {
    return this.gradeEntityRepository.create(dto).save();
  }

  public async update(where: FindOptionsWhere<GradeEntity>, dto: Partial<IGradeUpdateDto>): Promise<GradeEntity> {
    const { price, ...rest } = dto;
    const gradeEntity = await this.findOne(where, {
      join: {
        alias: "grade",
        leftJoinAndSelect: {
          price: "grade.price",
          components: "price.components",
        },
      },
    });

    if (!gradeEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    if (price) {
      await this.assetService.update(gradeEntity.price, price);
    }

    Object.assign(gradeEntity, rest);

    return gradeEntity.save();
  }

  public findOneWithRelations(where: FindOptionsWhere<GradeEntity>): Promise<GradeEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "grade",
        leftJoinAndSelect: {
          contract: "grade.contract",
          price: "grade.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }
}
