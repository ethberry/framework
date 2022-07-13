import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { utils, Wallet } from "ethers";

import { AirdropStatus, AssetType, IAirdropSearchDto, TokenType } from "@framework/types";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { IAirdropItem } from "./interfaces";
import { AirdropEntity } from "./airdrop.entity";
import { AssetService } from "../asset/asset.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Injectable()
export class AirdropService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    @InjectRepository(AirdropEntity)
    private readonly airdropEntityRepository: Repository<AirdropEntity>,
    protected readonly assetService: AssetService,
    protected readonly templateService: TemplateService,
  ) {}

  public async search(dto: Partial<IAirdropSearchDto>): Promise<[Array<AirdropEntity>, number]> {
    const { skip, take, account } = dto;

    const queryBuilder = this.airdropEntityRepository.createQueryBuilder("airdrop");

    queryBuilder.leftJoinAndSelect("airdrop.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "components");
    queryBuilder.leftJoinAndSelect("components.token", "token");
    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("components.contract", "contract");

    queryBuilder.select();

    if (account) {
      queryBuilder.andWhere("airdrop.account ILIKE '%' || :account || '%'", { account });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "airdrop.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<AirdropEntity>,
    options?: FindOneOptions<AirdropEntity>,
  ): Promise<AirdropEntity | null> {
    return this.airdropEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IAirdropItem): Promise<AirdropEntity> {
    const { account } = dto;

    const assetEntity = await this.assetService.create({
      assetType: AssetType.AIRDROP,
      externalId: "0",
      components: [],
    });

    const airdropEntity = await this.airdropEntityRepository
      .create({
        account,
        item: assetEntity,
        signature: "0x",
        nonce: "",
      })
      .save();

    return this.update({ id: airdropEntity.id }, dto);
  }

  public async update(where: FindOptionsWhere<AirdropEntity>, dto: IAirdropItem): Promise<AirdropEntity> {
    const { account, item } = dto;

    const airdropEntity = await this.findOne(where);

    if (!airdropEntity) {
      throw new NotFoundException("airdropNotFound");
    }

    // Update only NEW Airdrops
    if (airdropEntity.airdropStatus !== AirdropStatus.NEW) {
      throw new NotFoundException("airdropRedeemed");
    }

    await this.assetService.update(airdropEntity.item, item);

    const templateEntity = await this.templateService.findOne(
      { id: item.components[0].tokenId },
      { relations: { contract: true } },
    );
    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const nonce = utils.randomBytes(32);
    const signature = await this.airdropSign(nonce, account, templateEntity, item.components[0].amount);

    Object.assign(airdropEntity, { signature, nonce: utils.hexlify(nonce) });

    return airdropEntity.save();
  }

  public async delete(where: FindOptionsWhere<AirdropEntity>): Promise<DeleteResult> {
    return this.airdropEntityRepository.delete(where);
  }

  public async airdropSign(
    nonce: Uint8Array,
    account: string,
    templateEntity: TemplateEntity,
    amount: string,
  ): Promise<string> {
    return this.signer._signTypedData(
      // Domain
      {
        name: "Airdrop",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("AIRDROP_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "account", type: "address" },
          { name: "item", type: "Asset" },
        ],
        Asset: [
          { name: "tokenType", type: "uint256" },
          { name: "token", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
      // Value
      {
        nonce,
        account,
        item: {
          tokenType: Object.keys(TokenType).indexOf(templateEntity.contract.contractType),
          token: templateEntity.contract.address,
          tokenId: templateEntity.id,
          amount,
        },
      },
    );
  }
}
