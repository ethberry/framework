import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber, utils } from "ethers";

import { IServerSignature } from "@gemunion/types-collection";
import { IMysteryboxSearchDto, MysteryboxStatus, TokenType } from "@framework/types";
import { IAsset, IParams, SignerService } from "@gemunion/nest-js-module-exchange-signer";

import { ISignMysteryboxDto } from "./interfaces";
import { MysteryboxEntity } from "./mysterybox.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { TemplateService } from "../../hierarchy/template/template.service";

@Injectable()
export class MysteryboxService {
  constructor(
    @InjectRepository(MysteryboxEntity)
    private readonly mysteryboxEntityRepository: Repository<MysteryboxEntity>,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
  ) {}

  public async search(dto: IMysteryboxSearchDto): Promise<[Array<MysteryboxEntity>, number]> {
    const { query, skip, take, minPrice, maxPrice } = dto;

    const queryBuilder = this.mysteryboxEntityRepository.createQueryBuilder("mysterybox");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("mysterybox.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.leftJoinAndSelect("mysterybox.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.tokens", "price_tokens");

    queryBuilder.leftJoinAndSelect("mysterybox.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    queryBuilder.andWhere("mysterybox.mysteryboxStatus = :mysteryboxStatus", {
      mysteryboxStatus: MysteryboxStatus.ACTIVE,
    });

    if (maxPrice) {
      queryBuilder.andWhere("price_components.amount <= :maxPrice", { maxPrice });
    }

    if (minPrice) {
      queryBuilder.andWhere("price_components.amount >= :minPrice", { minPrice });
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(mysterybox.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("mysterybox.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "mysterybox.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<MysteryboxEntity>,
    options?: FindOneOptions<MysteryboxEntity>,
  ): Promise<MysteryboxEntity | null> {
    return this.mysteryboxEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<TemplateEntity>): Promise<MysteryboxEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "mysterybox",
        leftJoinAndSelect: {
          template: "mysterybox.template",
          contract: "template.contract",
          item: "mysterybox.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
          price: "mysterybox.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
          price_tokens: "price_template.tokens",
        },
      },
    });
  }

  public async sign(dto: ISignMysteryboxDto): Promise<IServerSignature> {
    const { mysteryboxId, account, referrer } = dto;

    const mysteryboxEntity = await this.findOneWithRelations({ id: mysteryboxId });

    if (!mysteryboxEntity) {
      throw new NotFoundException("mysteryboxNotFound");
    }

    const templateEntity = await this.templateService.findOne({ id: mysteryboxEntity.item.components[0].templateId });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: mysteryboxEntity.id,
        expiresAt,
        referrer,
      },
      mysteryboxEntity,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, mysteryboxEntity: MysteryboxEntity): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      params,
      ([] as Array<IAsset>).concat(
        mysteryboxEntity.item.components.map(component => ({
          tokenType: Object.keys(TokenType).indexOf(component.tokenType),
          token: component.contract.address,
          tokenId: component.templateId.toString(),
          amount: component.amount,
        })),
        {
          tokenType: Object.keys(TokenType).indexOf(TokenType.ERC721),
          token: mysteryboxEntity.template.contract.address,
          tokenId: mysteryboxEntity.id.toString(),
          amount: "1",
        },
      ),
      mysteryboxEntity.price.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
