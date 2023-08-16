import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IPaginationDto } from "@gemunion/types-collection";
import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { ModuleType, SettingsKeys, TokenType } from "@framework/types";

import type { ISignDropDto } from "./interfaces";
import { DropEntity } from "./drop.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { TemplateService } from "../../hierarchy/template/template.service";
import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { sorter } from "../../../common/utils/sorter";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Injectable()
export class DropService {
  constructor(
    @InjectRepository(DropEntity)
    private readonly dropEntityRepository: Repository<DropEntity>,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly settingsService: SettingsService,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<DropEntity>, number]> {
    const { skip, take } = dto;
    const now = new Date();

    const queryBuilder = this.dropEntityRepository.createQueryBuilder("drop");

    queryBuilder.leftJoinAndSelect("drop.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("drop.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.select();

    queryBuilder.andWhere("drop.startTimestamp < :startTimestamp", { startTimestamp: now });
    queryBuilder.andWhere("drop.endTimestamp > :endTimestamp", { endTimestamp: now });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "drop.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<DropEntity>,
    options?: FindOneOptions<DropEntity>,
  ): Promise<DropEntity | null> {
    return this.dropEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<TemplateEntity>): Promise<DropEntity | null> {
    const queryBuilder = this.dropEntityRepository.createQueryBuilder("drop");

    queryBuilder.leftJoinAndSelect("drop.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("drop.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    queryBuilder.leftJoinAndSelect("drop.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );
    queryBuilder.andWhere("drop.id = :id", {
      id: where.id,
    });
    return queryBuilder.getOne();
  }

  public async sign(dto: ISignDropDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, dropId, chainId } = dto;

    const dropEntity = await this.findOneWithRelations({ id: dropId });

    if (!dropEntity) {
      throw new NotFoundException("dropNotFound");
    }

    const now = Date.now();
    if (new Date(dropEntity.startTimestamp).getTime() > now) {
      throw new BadRequestException("dropNotYetStarted");
    }
    if (new Date(dropEntity.endTimestamp).getTime() < now) {
      throw new BadRequestException("dropAlreadyEnded");
    }
    const templateEntity = await this.templateService.findOne({
      id: dropEntity.item.components[0].templateId!,
    });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigInt(templateEntity.cap);
    if (cap > 0 && cap <= BigInt(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
      {
        externalId: dropEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: dropEntity.merchant.wallet,
        referrer,
      },
      dropEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: IParams,
    dropEntity: DropEntity,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      verifyingContract,
      account,
      params,
      dropEntity.item.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
      dropEntity.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
