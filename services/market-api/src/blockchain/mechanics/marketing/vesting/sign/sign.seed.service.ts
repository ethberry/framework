import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { wallets } from "@ethberry/constants";
import { ContractStatus, ModuleType, SettingsKeys, TokenType } from "@framework/types";

import {
  generateAsset,
  generateAssetComponent,
  generateTemplate,
  generateTestContract,
  generateTestMerchant,
  generateTestUser,
  generateVestingBox,
} from "../../../../../test";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { AssetComponentEntity } from "../../../../exchange/asset/asset-component.entity";
import { SettingsEntity } from "../../../../../infrastructure/settings/settings.entity";
import { VestingBoxEntity } from "../box/box.entity";

@Injectable()
export class VestingSignSeedService {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsEntityRepository: Repository<SettingsEntity>,
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
    @InjectRepository(TemplateEntity)
    private readonly templateEntityRepository: Repository<TemplateEntity>,
    @InjectRepository(AssetComponentEntity)
    private readonly assetComponentEntityRepository: Repository<AssetComponentEntity>,
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(VestingBoxEntity)
    private readonly vestingBoxEntityRepository: Repository<VestingBoxEntity>,
  ) {}

  public async setup(): Promise<any> {
    const settings1 = await this.settingsEntityRepository
      .create({
        key: SettingsKeys.SIGNATURE_TTL,
        value: 0,
      })
      .save();

    const merchant1 = await this.merchantEntityRepository
      .create(
        generateTestMerchant({
          wallet: wallets[0],
        }),
      )
      .save();

    const user1 = await this.userEntityRepository
      .create(
        generateTestUser({
          wallet: wallets[1],
        }),
      )
      .save();

    // nft
    const contract1 = await this.contractEntityRepository
      .create(
        generateTestContract({
          contractFeatures: [],
          contractType: TokenType.ERC721,
          contractStatus: ContractStatus.ACTIVE,
          contractModule: ModuleType.HIERARCHY,
          merchant: merchant1,
        }),
      )
      .save();

    // price
    const contract2 = await this.contractEntityRepository
      .create(
        generateTestContract({
          contractFeatures: [],
          contractType: TokenType.ERC20,
          contractStatus: ContractStatus.ACTIVE,
          contractModule: ModuleType.HIERARCHY,
          merchant: merchant1,
        }),
      )
      .save();

    // content
    const contract3 = await this.contractEntityRepository
      .create(
        generateTestContract({
          contractFeatures: [],
          contractType: TokenType.ERC20,
          contractStatus: ContractStatus.ACTIVE,
          contractModule: ModuleType.HIERARCHY,
          merchant: merchant1,
        }),
      )
      .save();

    // exchange
    const contract4 = await this.contractEntityRepository
      .create(
        generateTestContract({
          name: "EXCHANGE",

          contractModule: ModuleType.EXCHANGE,
          merchant: merchant1,
        }),
      )
      .save();

    // price
    const template2 = await this.templateEntityRepository
      .create(
        generateTemplate({
          contract: contract2,
        }),
      )
      .save();

    // price
    const asset1 = await this.assetEntityRepository.create(generateAsset()).save();

    // price
    const assetComponent1 = await this.assetComponentEntityRepository
      .create(
        generateAssetComponent({
          tokenType: TokenType.ERC20,
          contract: contract2,
          template: template2,
          asset: asset1,
        }),
      )
      .save();

    // nft
    const template1 = await this.templateEntityRepository
      .create(
        generateTemplate({
          contract: contract1,
          price: asset1,
        }),
      )
      .save();

    // content
    const template3 = await this.templateEntityRepository
      .create(
        generateTemplate({
          contract: contract3,
        }),
      )
      .save();

    // content
    const asset2 = await this.assetEntityRepository.create(generateAsset()).save();

    // content
    const assetComponent2 = await this.assetComponentEntityRepository
      .create(
        generateAssetComponent({
          tokenType: TokenType.ERC20,
          contract: contract3,
          template: template3,
          asset: asset2,
        }),
      )
      .save();

    const box1 = await this.vestingBoxEntityRepository
      .create(
        generateVestingBox({
          template: template1,
          content: asset2,
        }),
      )
      .save();

    return {
      settings: [settings1],
      merchants: [merchant1],
      users: [user1],
      contracts: [contract1, contract2, contract3, contract4],
      templates: [template1, template2, template3],
      assets: [asset1, asset2],
      assetComponents: [assetComponent1, assetComponent2],
      boxes: [box1],
    };
  }

  public async tearDown(): Promise<void> {
    await this.settingsEntityRepository.delete({});
    await this.merchantEntityRepository.delete({});
    await this.userEntityRepository.delete({});
    await this.contractEntityRepository.delete({});
    await this.templateEntityRepository.delete({});
    await this.assetEntityRepository.delete({});
    await this.assetComponentEntityRepository.delete({});
    await this.vestingBoxEntityRepository.delete({});
  }
}
