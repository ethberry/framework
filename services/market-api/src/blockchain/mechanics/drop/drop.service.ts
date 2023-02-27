import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber, constants, utils } from "ethers";

import type { IPaginationDto } from "@gemunion/types-collection";
import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { TokenType } from "@framework/types";

import { ISignDropDto } from "./interfaces";
import { DropEntity } from "./drop.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { TemplateService } from "../../hierarchy/template/template.service";

@Injectable()
export class DropService {
  constructor(
    @InjectRepository(DropEntity)
    private readonly dropEntityRepository: Repository<DropEntity>,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
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
    queryBuilder.leftJoinAndSelect("price_template.tokens", "price_tokens");

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
    return this.findOne(where, {
      join: {
        alias: "drop",
        leftJoinAndSelect: {
          item: "drop.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
          price: "drop.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
          price_tokens: "price_template.tokens",
        },
      },
    });
  }

  public async sign(dto: ISignDropDto): Promise<IServerSignature> {
    const { account, referrer = constants.AddressZero, dropId } = dto;

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

    const templateEntity = await this.templateService.findOne({ id: dropEntity.item.components[0].templateId });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const nonce = utils.randomBytes(32);
    const expiresAt = Math.ceil(new Date(dropEntity.endTimestamp).getTime() / 1000);
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: dropEntity.id,
        expiresAt,
        referrer,
      },
      dropEntity,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, dropEntity: DropEntity): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      params,
      dropEntity.item.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.templateId.toString(),
        amount: component.amount,
      })),
      dropEntity.price.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
