import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { TemplateStatus, TokenType } from "@framework/types";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { IVestingBoxSearchDto } from "./interfaces";
import { VestingBoxEntity } from "./box.entity";

@Injectable()
export class VestingBoxService {
  constructor(
    @InjectRepository(VestingBoxEntity)
    protected readonly vestingBoxEntityRepository: Repository<VestingBoxEntity>,
  ) {}

  public async search(
    dto: Partial<IVestingBoxSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<VestingBoxEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.vestingBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "content_components");
    queryBuilder.leftJoinAndSelect("content_components.template", "content_template");
    queryBuilder.leftJoinAndSelect("content_template.contract", "content_contract");

    queryBuilder.leftJoinAndSelect(
      "content_template.tokens",
      "content_tokens",
      "content_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20] },
    );

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.contract", "price_contract");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20] },
    );

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

  public findOneWithRelations(where: FindOptionsWhere<VestingBoxEntity>): Promise<VestingBoxEntity | null> {
    const queryBuilder = this.vestingBoxEntityRepository.createQueryBuilder("box");
    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "content_components");
    queryBuilder.leftJoinAndSelect("content_components.template", "content_template");
    queryBuilder.leftJoinAndSelect("content_template.contract", "content_contract");
    queryBuilder.leftJoinAndSelect(
      "content_template.tokens",
      "content_tokens",
      "content_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20] },
    );

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.contract", "price_contract");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20] },
    );
    queryBuilder.andWhere("box.template.id = :id", {
      id: where.id,
    });

    // content or price template must be active
    queryBuilder.andWhere("content_template.templateStatus = :templateStatus", {
      templateStatus: TemplateStatus.ACTIVE,
    });
    queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    return queryBuilder.getOne();
  }
}
