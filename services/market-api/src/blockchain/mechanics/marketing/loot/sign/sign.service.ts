import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { ModuleType, RatePlanType, SettingsKeys, TokenType } from "@framework/types";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { LootBoxService } from "../box/box.service";
import { LootBoxEntity } from "../box/box.entity";
import type { ISignLootboxDto } from "./interfaces";

@Injectable()
export class LootSignService {
  constructor(
    private readonly lootBoxService: LootBoxService,
    private readonly contractService: ContractService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: ISignLootboxDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, lootBoxId, chainId } = dto;

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
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
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
    params: IParams,
    lootBoxEntity: LootBoxEntity,
  ): Promise<string> {
    const items = convertDatabaseAssetToChainAsset(lootBoxEntity.item.components);
    const price = convertDatabaseAssetToChainAsset(lootBoxEntity.template.price.components);

    return this.signerService.getManyToManySignature(
      verifyingContract,
      account,
      params,
      [
        ...items,
        {
          tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
          token: lootBoxEntity.template.contract.address,
          tokenId: lootBoxEntity.templateId.toString(),
          amount: "1",
        },
      ],
      price,
    );
  }
}
