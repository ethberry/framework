import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import type { IDismantleSearchDto, ISignDismantleDto } from "@framework/types";
import { DismantleStatus, ModuleType, SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../../../infrastructure/settings/settings.service";
import { sorter } from "../../../../common/utils/sorter";
import { DismantleEntity } from "./dismantle.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Injectable()
export class DismantleService {
  constructor(
    @InjectRepository(DismantleEntity)
    private readonly dismantleEntityRepository: Repository<DismantleEntity>,
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly settingsService: SettingsService,
  ) {}

  public search(dto: Partial<IDismantleSearchDto>): Promise<[Array<DismantleEntity>, number]> {
    const { query, templateId, skip, take } = dto;

    const queryBuilder = this.dismantleEntityRepository.createQueryBuilder("dismantle");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("dismantle.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("dismantle.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("dismantle.price", "price");
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
      dismantleStatus: DismantleStatus.ACTIVE,
    });

    if (templateId) {
      queryBuilder.where("item_template.id = :templateId", { templateId });
    }

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(item_template.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
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
    where: FindOptionsWhere<DismantleEntity>,
    options?: FindOneOptions<DismantleEntity>,
  ): Promise<DismantleEntity | null> {
    return this.dismantleEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<DismantleEntity>): Promise<DismantleEntity | null> {
    const queryBuilder = this.dismantleEntityRepository.createQueryBuilder("dismantle");

    queryBuilder.leftJoinAndSelect("dismantle.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("dismantle.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    queryBuilder.leftJoinAndSelect(
      "item_template.tokens",
      "item_tokens",
      "item_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.leftJoinAndSelect("dismantle.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.andWhere("dismantle.id = :id", {
      id: where.id,
    });
    return queryBuilder.getOne();
  }

  public async sign(dto: ISignDismantleDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, dismantleId, chainId } = dto;
    const dismantleEntity = await this.findOneWithRelations({ id: dismantleId });

    if (!dismantleEntity) {
      throw new NotFoundException("dismantleNotFound");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
      {
        externalId: dismantleEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: dismantleEntity.merchant.wallet,
        referrer,
      },
      dismantleEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: IParams,
    dismantleEntity: DismantleEntity,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      verifyingContract,
      account,
      params,
      dismantleEntity.item.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId:
          component.contract.contractType === TokenType.ERC1155
            ? component.template.tokens[0].tokenId
            : (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
      dismantleEntity.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
