import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IGradeSearchDto } from "@framework/types";
import { GradeStatus } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { AssetService } from "../../exchange/asset/asset.service";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TokenService } from "../../hierarchy/token/token.service";
import type { IGradeCreateDto, IGradeUpdateDto } from "./interfaces";
import { GradeEntity } from "./grade.entity";

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    protected readonly gradeEntityRepository: Repository<GradeEntity>,
    protected readonly assetService: AssetService,
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
  ) {}

  public async search(dto: Partial<IGradeSearchDto>, _userEntity: UserEntity): Promise<[Array<GradeEntity>, number]> {
    const { query, gradeStatus, merchantId, skip, take } = dto;

    const queryBuilder = this.gradeEntityRepository.createQueryBuilder("grade");

    queryBuilder.leftJoinAndSelect("grade.contract", "contract");

    queryBuilder.select();

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId,
    });

    if (gradeStatus) {
      if (gradeStatus.length === 1) {
        queryBuilder.andWhere("grade.gradeStatus = :gradeStatus", { gradeStatus: gradeStatus[0] });
      } else {
        queryBuilder.andWhere("grade.gradeStatus IN(:...gradeStatus)", { gradeStatus });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(contract.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("contract.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

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

    const assetEntity = await this.assetService.create();
    await this.assetService.update(assetEntity, price, userEntity);

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

  public async update(
    where: FindOptionsWhere<GradeEntity>,
    dto: Partial<IGradeUpdateDto>,
    userEntity: UserEntity,
  ): Promise<GradeEntity> {
    const { price, ...rest } = dto;

    const gradeEntity = await this.findOne(where, {
      relations: {
        contract: true,
        price: {
          components: true,
        },
      },
    });

    if (!gradeEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    if (gradeEntity.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (price) {
      await this.assetService.update(gradeEntity.price, price, userEntity);
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

  public delete(where: FindOptionsWhere<GradeEntity>, userEntity: UserEntity): Promise<GradeEntity> {
    return this.update(where, { gradeStatus: GradeStatus.INACTIVE }, userEntity);
  }
}
