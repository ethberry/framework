import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { wallets } from "@gemunion/constants";
import { ModuleType, TokenType } from "@framework/types";

import {
  generateTestAsset,
  generateTestAssetComponent,
  generateTestContract,
  generateTestMerchant,
  generateTestMysteryBox,
  generateTestTemplate,
  generateTestUser,
} from "../../../../../test";
import { MysteryBoxEntity } from "./box.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { AssetComponentEntity } from "../../../../exchange/asset/asset-component.entity";

@Injectable()
export class MysteryBoxSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
    @InjectRepository(TemplateEntity)
    private readonly templateEntityRepository: Repository<TemplateEntity>,
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(AssetComponentEntity)
    private readonly assetComponentEntityRepository: Repository<AssetComponentEntity>,
    @InjectRepository(MysteryBoxEntity)
    private readonly mysteryBoxEntityRepository: Repository<MysteryBoxEntity>,
  ) {}

  public async setup(): Promise<any> {
    const merchant1 = await this.merchantEntityRepository
      .create(
        generateTestMerchant({
          wallet: wallets[0],
        }),
      )
      .save();

    const merchant2 = await this.merchantEntityRepository
      .create(
        generateTestMerchant({
          wallet: wallets[1],
        }),
      )
      .save();

    const user1 = await this.userEntityRepository
      .create(
        generateTestUser({
          merchant: merchant1,
        }),
      )
      .save();

    const user2 = await this.userEntityRepository
      .create(
        generateTestUser({
          merchant: merchant2,
        }),
      )
      .save();

    const contract1 = await this.contractEntityRepository
      .create(
        generateTestContract({
          merchant: merchant1,
        }),
      )
      .save();

    const contract2 = await this.contractEntityRepository
      .create(
        generateTestContract({
          merchant: merchant1,
          contractType: TokenType.ERC721,
          contractModule: ModuleType.MYSTERY,
        }),
      )
      .save();

    const contract3 = await this.contractEntityRepository
      .create(
        generateTestContract({
          merchant: merchant2,
        }),
      )
      .save();

    const contract4 = await this.contractEntityRepository
      .create(
        generateTestContract({
          merchant: merchant2,
          contractType: TokenType.ERC721,
          contractModule: ModuleType.MYSTERY,
        }),
      )
      .save();

    const template1 = await this.templateEntityRepository
      .create(
        generateTestTemplate({
          contract: contract1,
        }),
      )
      .save();

    const template2 = await this.templateEntityRepository
      .create(
        generateTestTemplate({
          contract: contract2,
        }),
      )
      .save();

    const template3 = await this.templateEntityRepository
      .create(
        generateTestTemplate({
          contract: contract3,
        }),
      )
      .save();

    const template4 = await this.templateEntityRepository
      .create(
        generateTestTemplate({
          contract: contract4,
        }),
      )
      .save();

    const asset1 = await this.assetEntityRepository.create(generateTestAsset({})).save();

    const asset2 = await this.assetEntityRepository.create(generateTestAsset({})).save();

    const component1 = await this.assetComponentEntityRepository
      .create(
        generateTestAssetComponent({
          contract: contract1,
          template: template1,
          asset: asset1,
        }),
      )
      .save();

    const component2 = await this.assetComponentEntityRepository
      .create(
        generateTestAssetComponent({
          contract: contract3,
          template: template3,
          asset: asset2,
        }),
      )
      .save();

    const box1 = await this.mysteryBoxEntityRepository
      .create(
        generateTestMysteryBox({
          template: template2,
          item: asset1,
        }),
      )
      .save();

    const box2 = await this.mysteryBoxEntityRepository
      .create(
        generateTestMysteryBox({
          template: template4,
          item: asset2,
        }),
      )
      .save();

    return {
      users: [user1, user2],
      merchants: [merchant1, merchant2],
      contracts: [contract1, contract2],
      templates: [template1, template2],
      assets: [asset1, asset2],
      components: [component1, component2],
      boxes: [box1, box2],
    };
  }

  public async tearDown(): Promise<void> {
    await this.userEntityRepository.delete({});
    await this.merchantEntityRepository.delete({});
    await this.contractEntityRepository.delete({});
    await this.templateEntityRepository.delete({});
    await this.assetComponentEntityRepository.delete({});
    await this.assetEntityRepository.delete({});
    await this.mysteryBoxEntityRepository.delete({});
  }
}
