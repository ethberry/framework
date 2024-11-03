import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import {
  IVestingBoxAutocompleteDto,
  IVestingBoxSearchDto,
  VestingType,
  TemplateStatus,
  TokenType,
  VestingBoxStatus,
} from "@framework/types";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { VestingBoxEntity } from "./box.entity";
import { IVestingBoxCreateDto, IVestingBoxUpdateDto } from "./interfaces";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { TemplateService } from "../../../../hierarchy/template/template.service";
import { TemplateDeleteService } from "../../../../hierarchy/template/template.delete.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { AssetService } from "../../../../exchange/asset/asset.service";

import { AssetEntity } from "../../../../exchange/asset/asset.entity";

@Injectable()
export class VestingBoxService {
  constructor(
    @InjectRepository(VestingBoxEntity)
    protected readonly vestingBoxEntityRepository: Repository<VestingBoxEntity>,
    private readonly tokenService: TokenService,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
    @Inject(forwardRef(() => TemplateDeleteService))
    private readonly templateDeleteService: TemplateDeleteService,
    private readonly contractService: ContractService,
    private readonly assetService: AssetService,
  ) {}

  public async search(
    dto: Partial<IVestingBoxSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<VestingBoxEntity>, number]> {
    const { vestingBoxStatus, contractIds, query, skip, take } = dto;

    const queryBuilder = this.vestingBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "content_components");
    queryBuilder.leftJoinAndSelect("content_components.template", "content_template");
    queryBuilder.leftJoinAndSelect("content_template.contract", "content_contract");

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_template.tokens", "price_tokens");

    // content or price template must be active
    queryBuilder.andWhere("content_template.templateStatus = :templateStatus", {
      templateStatus: TemplateStatus.ACTIVE,
    });
    queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(box.description->'blocks')`;
          return qb;
        },
        "blocks",
        "TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("box.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (vestingBoxStatus) {
      if (vestingBoxStatus.length === 1) {
        queryBuilder.andWhere("box.vestingBoxStatus = :vestingBoxStatus", {
          vestingBoxStatus: vestingBoxStatus[0],
        });
      } else {
        queryBuilder.andWhere("box.vestingBoxStatus IN(:...vestingBoxStatus)", { vestingBoxStatus });
      }
    }

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "box.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IVestingBoxAutocompleteDto, userEntity: UserEntity): Promise<Array<VestingBoxEntity>> {
    const { contractIds } = dto;
    const queryBuilder = this.vestingBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    // content
    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "components");
    queryBuilder.leftJoinAndSelect("components.template", "content_template");
    queryBuilder.leftJoinAndSelect("content_template.contract", "content_contract");

    queryBuilder.leftJoinAndSelect(
      "content_template.tokens",
      "token",
      "content_contract.contractType = :contractType",
      {
        contractType: TokenType.ERC1155,
      },
    );
    // price
    // queryBuilder.leftJoinAndSelect("box.price", "price");
    // queryBuilder.leftJoinAndSelect("price.components", "price_components");
    // queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    // queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    // content or price template must be active
    queryBuilder.andWhere("content_template.templateStatus = :templateStatus", {
      templateStatus: TemplateStatus.ACTIVE,
    });
    // queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    queryBuilder.orderBy({
      "box.title": "ASC",
    });

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<VestingBoxEntity>,
    options?: FindOneOptions<VestingBoxEntity>,
  ): Promise<VestingBoxEntity | null> {
    return this.vestingBoxEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<VestingBoxEntity>,
    options?: FindManyOptions<VestingBoxEntity>,
  ): Promise<Array<VestingBoxEntity>> {
    return this.vestingBoxEntityRepository.find({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<VestingBoxEntity>): Promise<VestingBoxEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "box",
        leftJoinAndSelect: {
          template: "box.template",
          content: "box.content",
          content_components: "content.components",
          content_template: "content_components.template",
          content_contract: "content_template.contract",
          price: "template.price",
          price_components: "price.components",
          price_template: "price_components.template",
          price_contract: "price_template.contract",
        },
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  public async update(
    where: FindOptionsWhere<VestingBoxEntity>,
    dto: Partial<IVestingBoxUpdateDto>,
    userEntity: UserEntity,
  ): Promise<VestingBoxEntity> {
    const { price, content, ...rest } = dto;

    const vestingBoxEntity = await this.findOne(where, {
      join: {
        alias: "box",
        leftJoinAndSelect: {
          template: "box.template",
          contract: "template.contract",
          content: "box.content",
          content_components: "content.components",
          price: "template.price",
          price_components: "price.components",
        },
      },
    });

    if (!vestingBoxEntity) {
      throw new NotFoundException("vestingBoxNotFound");
    }

    if (vestingBoxEntity.template.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (price) {
      await this.assetService.update(vestingBoxEntity.template.price, price, userEntity);
    }

    if (content) {
      await this.assetService.update(vestingBoxEntity.content, content, userEntity);
    }

    // SYNC UPDATE TEMPLATE
    const { title, description, imageUrl } = rest;
    await this.templateService.update(
      { id: vestingBoxEntity.templateId },
      { title, description, imageUrl },
      userEntity,
    );

    Object.assign(vestingBoxEntity, rest);

    return vestingBoxEntity.save();
  }

  public async create(dto: IVestingBoxCreateDto, userEntity: UserEntity): Promise<VestingBoxEntity> {
    const { price, content, contractId, shape } = dto;

    const contractEntity = await this.contractService.findOne({ id: contractId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const priceEntity = await this.assetService.create();
    await this.assetService.update(priceEntity, price, userEntity);

    const contentEntity = await this.assetService.create();
    await this.assetService.update(contentEntity, content, userEntity);

    const templateEntity = await this.templateService.create({
      title: dto.title,
      description: dto.description,
      price: priceEntity,
      amount: "0",
      imageUrl: dto.imageUrl,
      contractId: contractEntity.id,
    });

    const functionType = shape.split("_")[0] as VestingType;

    return this.vestingBoxEntityRepository
      .create({
        ...dto,
        shape,
        functionType,
        content: contentEntity,
        template: templateEntity,
      })
      .save();
  }

  public async delete(where: FindOptionsWhere<VestingBoxEntity>, userEntity: UserEntity): Promise<VestingBoxEntity> {
    const vestingBoxEntity = await this.findOne({ id: where.id }, { relations: { template: { contract: true } } });

    if (!vestingBoxEntity) {
      throw new NotFoundException("vestingBoxNotFound");
    }

    if (vestingBoxEntity.template.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const count = await this.tokenService.count({ templateId: vestingBoxEntity.templateId });

    if (count) {
      await this.templateService.update(
        { id: vestingBoxEntity.templateId },
        { templateStatus: TemplateStatus.INACTIVE },
        userEntity,
      );
      Object.assign(vestingBoxEntity, { vestingBoxStatus: VestingBoxStatus.INACTIVE });
      return vestingBoxEntity.save();
    } else {
      await this.templateService.delete({ id: vestingBoxEntity.templateId }, userEntity);
      return vestingBoxEntity.remove();
    }
  }

  public async deactivateBoxes(assets: Array<AssetEntity>): Promise<DeleteResult> {
    const vestingBoxEntities = await this.vestingBoxEntityRepository.find({
      where: [
        {
          content: In(assets.map(asset => asset.id)),
        },
        {
          template: {
            price: In(assets.map(asset => asset.id)),
          },
        },
      ],
    });

    for (const vestingBoxEntity of vestingBoxEntities) {
      await this.templateDeleteService.deactivateTemplate(vestingBoxEntity.template);
    }

    return await this.vestingBoxEntityRepository.delete({
      id: In(vestingBoxEntities.map(vestingBoxEntity => vestingBoxEntity.id)),
    });
  }
}
