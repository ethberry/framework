import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber, utils } from "ethers";

import { IServerSignature } from "@gemunion/types-collection";
import { ILootboxSearchDto, TokenType } from "@framework/types";

import { ISignLootboxDto } from "./interfaces";
import { LootboxEntity } from "./lootbox.entity";
import { SignerService } from "../signer/signer.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";

@Injectable()
export class LootboxService {
  constructor(
    @InjectRepository(LootboxEntity)
    private readonly lootboxEntityRepository: Repository<LootboxEntity>,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
  ) {}

  public async search(dto: ILootboxSearchDto): Promise<[Array<LootboxEntity>, number]> {
    const { query, lootboxStatus, skip, take } = dto;

    const queryBuilder = this.lootboxEntityRepository.createQueryBuilder("lootbox");

    queryBuilder.select();

    // queryBuilder.leftJoinAndSelect("lootbox.contract", "contract");

    queryBuilder.leftJoinAndSelect("lootbox.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.tokens", "price_tokens");

    queryBuilder.leftJoinAndSelect("lootbox.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    if (lootboxStatus) {
      if (lootboxStatus.length === 1) {
        queryBuilder.andWhere("lootbox.lootboxStatus = :lootboxStatus", { lootboxStatus: lootboxStatus[0] });
      } else {
        queryBuilder.andWhere("lootbox.lootboxStatus IN(:...lootboxStatus)", { lootboxStatus });
      }
    }

    // TODO restore
    // if (maxPrice) {
    //   queryBuilder.andWhere("lootbox.price <= :maxPrice", { maxPrice });
    // }
    //
    // if (minPrice) {
    //   queryBuilder.andWhere("lootbox.price >= :minPrice", { minPrice });
    // }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(lootbox.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("lootbox.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    // if (templateContractIds) {
    //   if (templateContractIds.length === 1) {
    //     queryBuilder.andWhere("template.contractId = :contractId", {
    //       templateContractId: templateContractIds[0],
    //     });
    //   } else {
    //     queryBuilder.andWhere("template.contractId IN(:...templateContractIds)", {
    //       templateContractIds,
    //     });
    //   }
    // }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "lootbox.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<LootboxEntity>,
    options?: FindOneOptions<LootboxEntity>,
  ): Promise<LootboxEntity | null> {
    return this.lootboxEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<TemplateEntity>): Promise<LootboxEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "lootbox",
        leftJoinAndSelect: {
          price: "lootbox.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
          price_tokens: "price_template.tokens",
        },
      },
    });
  }

  public async sign(dto: ISignLootboxDto): Promise<IServerSignature> {
    const { lootboxId, account } = dto;

    const lootboxEntity = await this.findOne(
      { id: lootboxId },
      {
        join: {
          alias: "lootbox",
          leftJoinAndSelect: {
            item: "lootbox.item",
            item_components: "item.components",
          },
        },
      },
    );

    if (!lootboxEntity) {
      throw new NotFoundException("lootboxNotFound");
    }

    const templateEntity = await this.templateService.findOne(
      { id: lootboxEntity.item.components[0].templateId },
      {
        join: {
          alias: "template",
          leftJoinAndSelect: {
            contract: "template.contract",
            price: "template.price",
            price_components: "price.components",
            price_template: "price_components.template",
            price_contract: "price_components.contract",
            price_tokens: "price_template.tokens",
          },
        },
      },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new NotFoundException("limitExceeded");
    }

    const nonce = utils.randomBytes(32);

    const signature = await this.getSignature(nonce, account, templateEntity);
    return { nonce: utils.hexlify(nonce), signature };
  }

  public async getSignature(nonce: Uint8Array, account: string, templateEntity: TemplateEntity): Promise<string> {
    return this.signerService.getSignature(
      nonce,
      account,
      [
        {
          tokenType: Object.keys(TokenType).indexOf(templateEntity.contract.contractType),
          token: templateEntity.contract.address,
          tokenId: templateEntity.id.toString(),
          amount: "1",
        },
      ],
      templateEntity.price.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
