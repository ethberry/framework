import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { utils } from "ethers";

import { ISearchDto, IServerSignature } from "@gemunion/types-collection";
import { CraftStatus, TokenType } from "@framework/types";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";

import { ISignCraftDto } from "./interfaces";
import { CraftEntity } from "./craft.entity";
import { UserEntity } from "../../user/user.entity";

@Injectable()
export class CraftService {
  constructor(
    @InjectRepository(CraftEntity)
    private readonly craftEntityRepository: Repository<CraftEntity>,
    private readonly signerService: SignerService,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<CraftEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.craftEntityRepository.createQueryBuilder("craft");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("craft.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("craft.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");

    queryBuilder.where({
      craftStatus: CraftStatus.ACTIVE,
    });

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(token.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("token.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<CraftEntity>,
    options?: FindOneOptions<CraftEntity>,
  ): Promise<CraftEntity | null> {
    return this.craftEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<CraftEntity>): Promise<CraftEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "craft",
        leftJoinAndSelect: {
          item: "craft.item",
          item_components: "item.components",
          item_template: "item_components.template",
          item_contract: "item_components.contract",
          item_tokens: "item_template.tokens",
          price: "craft.price",
          price_components: "price.components",
          price_template: "price_components.template",
          price_contract: "price_components.contract",
          price_tokens: "price_template.tokens",
        },
      },
    });
  }

  public async sign(dto: ISignCraftDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { craftId } = dto;
    const craftEntity = await this.findOneWithRelations({ id: craftId });

    if (!craftEntity) {
      throw new NotFoundException("craftNotFound");
    }

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(nonce, userEntity.wallet, expiresAt, craftEntity);

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    nonce: Uint8Array,
    account: string,
    expiresAt: number,
    craftEntity: CraftEntity,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      {
        nonce,
        externalId: craftEntity.id,
        expiresAt,
      },
      craftEntity.item.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
      craftEntity.price.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
