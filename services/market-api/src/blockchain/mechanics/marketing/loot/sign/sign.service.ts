import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress, keccak256, AbiCoder } from "ethers";

import type { IServerSignature, ISignatureParams } from "@ethberry/types-blockchain";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { ModuleType, RatePlanType, SettingsKeys, TokenType } from "@framework/types";
import type { ILootBoxSignDto } from "@framework/types";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { LootBoxService } from "../box/box.service";
import { LootBoxEntity } from "../box/box.entity";

@Injectable()
export class LootSignService {
  constructor(
    private readonly lootBoxService: LootBoxService,
    private readonly contractService: ContractService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: ILootBoxSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, lootBoxId } = dto;

    const lootBoxEntity = await this.lootBoxService.findOneWithRelations({ id: lootBoxId });

    if (!lootBoxEntity) {
      throw new NotFoundException("lootBoxNotFound");
    }

    if (lootBoxEntity.template.contract.merchant.ratePlan === RatePlanType.BRONZE) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const cap = BigInt(lootBoxEntity.template.cap);
    if (cap > 0 && cap <= BigInt(lootBoxEntity.template.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;

    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId: userEntity.chainId }),
      userEntity.wallet,
      {
        externalId: lootBoxEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: lootBoxEntity.template.contract.merchant.wallet,
        referrer,
      },
      lootBoxEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: ISignatureParams,
    lootBoxEntity: LootBoxEntity,
  ): Promise<string> {
    const content = convertDatabaseAssetToChainAsset(lootBoxEntity.content.components);
    const price = convertDatabaseAssetToChainAsset(lootBoxEntity.template.price.components);

    return this.signerService.getOneToManyToManySignature(
      verifyingContract,
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
        token: lootBoxEntity.template.contract.address,
        tokenId: lootBoxEntity.templateId.toString(),
        amount: "1",
      },
      price,
      content,
      keccak256(AbiCoder.defaultAbiCoder().encode(["uint128", "uint128"], [lootBoxEntity.min, lootBoxEntity.max])),
    );
  }
}
