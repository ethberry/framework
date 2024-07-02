import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { ModuleType, RatePlanType, SettingsKeys, TokenType } from "@framework/types";
import type { ILootBoxSignDto } from "@framework/types";

import { sorter } from "../../../../../common/utils/sorter";
import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
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

  public async sign(dto: ILootBoxSignDto, merchantEntity: MerchantEntity): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, lootBoxId, chainId } = dto;

    if (merchantEntity.ratePlan === RatePlanType.BRONZE) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const lootBoxEntity = await this.lootBoxService.findOneWithRelationsOrFail({ id: lootBoxId }, merchantEntity);

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
    return this.signerService.getManyToManySignature(
      verifyingContract,
      account,
      params,
      [
        ...lootBoxEntity.item.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract.address,
          // tokenId: (component.templateId || 0).toString(), // suppression types check with 0
          tokenId:
            component.contract.contractType === TokenType.ERC1155
              ? component.template.tokens[0].tokenId
              : (component.templateId || 0).toString(),
          amount: component.amount,
        })),
        {
          tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
          token: lootBoxEntity.template.contract.address,
          tokenId: lootBoxEntity.templateId.toString(),
          amount: "1",
        },
      ],
      lootBoxEntity.template.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
