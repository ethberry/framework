import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindManyOptions, FindOptionsWhere, Repository, In } from "typeorm";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature, ISignatureParams } from "@gemunion/types-blockchain";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import type { ICraftSearchDto, ICraftSignDto, ICraftCountDto, ICraftCountResult } from "@framework/types";
import { CraftStatus, ModuleType, SettingsKeys, TemplateStatus, TokenType } from "@framework/types";

import { sorter } from "../../../../../common/utils/sorter";
import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { CraftEntity } from "./craft.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@Injectable()
export class CraftService {
  constructor(
    @InjectRepository(CraftEntity)
    private readonly craftEntityRepository: Repository<CraftEntity>,
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly settingsService: SettingsService,
  ) {}

  public search(dto: Partial<ICraftSearchDto>): Promise<[Array<CraftEntity>, number]> {
    const { query, contractId, templateId, skip, take } = dto;

    const queryBuilder = this.craftEntityRepository.createQueryBuilder("craft");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("craft.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("craft.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    queryBuilder.leftJoinAndSelect(
      "item_template.tokens",
      "item_tokens",
      "item_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.leftJoinAndSelect("craft.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.where({
      craftStatus: CraftStatus.ACTIVE,
    });

    // item or price template must be active
    queryBuilder.andWhere("item_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });
    queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    if (contractId) {
      queryBuilder.where("item_contract.id = :contractId", { contractId });
    }

    if (templateId) {
      queryBuilder.where("item_template.id = :templateId", { templateId });
    }

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(item_template.description->'blocks')`;
          return qb;
        },
        "blocks",
        "TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("item_template.title ILIKE '%' || :title || '%'", { title: query });
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
    const queryBuilder = this.craftEntityRepository.createQueryBuilder("craft");

    queryBuilder.leftJoinAndSelect("craft.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("craft.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    queryBuilder.leftJoinAndSelect(
      "item_template.tokens",
      "item_tokens",
      "item_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.leftJoinAndSelect("craft.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.andWhere("craft.id = :id", {
      id: where.id,
    });
    return queryBuilder.getOne();
  }

  public findAll(
    where: FindOptionsWhere<CraftEntity>,
    options?: FindManyOptions<CraftEntity>,
  ): Promise<Array<CraftEntity>> {
    return this.craftEntityRepository.find({ where, ...options });
  }

  public async sign(dto: ICraftSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, craftId } = dto;
    const craftEntity = await this.findOneWithRelations({ id: craftId });

    if (!craftEntity) {
      throw new NotFoundException("craftNotFound");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId: userEntity.chainId }),
      userEntity.wallet,
      {
        externalId: craftEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: craftEntity.merchant.wallet,
        referrer,
      },
      craftEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: ISignatureParams,
    craftEntity: CraftEntity,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      verifyingContract,
      account,
      params,
      craftEntity.item.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId:
          component.contract.contractType === TokenType.ERC1155
            ? component.template.tokens[0].tokenId
            : (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
      craftEntity.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }

  public async count(dto: ICraftCountDto): Promise<ICraftCountResult> {
    const { contractId } = dto;
    const queryBuilder = this.craftEntityRepository.createQueryBuilder("craft");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("craft.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.andWhere("item_contract.id = :contractId", {
      contractId,
    });

    const count = await queryBuilder.getCount();

    return { count };
  }

  public async deactivateCrafts(assets: Array<AssetEntity>): Promise<void> {
    const craftEntities = await this.findAll(
      {
        item: In(assets.map(asset => asset.id)),
      },
      { relations: { item: { components: true } } },
    );

    for (const craftEntity of craftEntities) {
      await Object.assign(craftEntity, { craftStatus: CraftStatus.INACTIVE }).save();
    }
  }
}
