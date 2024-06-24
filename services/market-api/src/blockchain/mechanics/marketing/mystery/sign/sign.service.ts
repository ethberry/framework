import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { ModuleType, RatePlanType, SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { MysteryBoxService } from "../box/box.service";
import { MysteryBoxEntity } from "../box/box.entity";
import type { IMysteryboxSignDto } from "./interfaces";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@Injectable()
export class MysterySignService {
  constructor(
    private readonly mysteryBoxService: MysteryBoxService,
    private readonly contractService: ContractService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: IMysteryboxSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, mysteryBoxId } = dto;

    const mysteryBoxEntity = await this.mysteryBoxService.findOneWithRelations({ id: mysteryBoxId });

    if (!mysteryBoxEntity) {
      throw new NotFoundException("mysteryBoxNotFound");
    }

    if (mysteryBoxEntity.template.contract.merchant.ratePlan === RatePlanType.BRONZE) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const cap = BigInt(mysteryBoxEntity.template.cap);
    if (cap > 0 && cap <= BigInt(mysteryBoxEntity.template.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;

    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId: userEntity.chainId }),
      userEntity.wallet,
      {
        externalId: mysteryBoxEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: mysteryBoxEntity.template.contract.merchant.wallet,
        referrer,
      },
      mysteryBoxEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: IParams,
    mysteryBoxEntity: MysteryBoxEntity,
  ): Promise<string> {
    const items = convertDatabaseAssetToChainAsset(mysteryBoxEntity.item.components);
    const price = convertDatabaseAssetToChainAsset(mysteryBoxEntity.template.price.components);

    return this.signerService.getManyToManySignature(
      verifyingContract,
      account,
      params,
      [
        ...items,
        {
          tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
          token: mysteryBoxEntity.template.contract.address,
          tokenId: mysteryBoxEntity.templateId.toString(),
          amount: "1",
        },
      ],
      price,
    );
  }
}
