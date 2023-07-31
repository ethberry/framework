import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { RatePlanType, SettingsKeys, TokenType } from "@framework/types";

import { sorter } from "../../../../common/utils/sorter";
import { SettingsService } from "../../../../infrastructure/settings/settings.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { MysteryBoxService } from "../box/box.service";
import { MysteryBoxEntity } from "../box/box.entity";
import { ISignMysteryboxDto } from "./interfaces";

@Injectable()
export class MysterySignService {
  constructor(
    private readonly mysteryBoxService: MysteryBoxService,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: ISignMysteryboxDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, mysteryboxId } = dto;

    const mysteryBoxEntity = await this.mysteryBoxService.findOneWithRelations({ id: mysteryboxId });

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
      account,
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

  public async getSignature(account: string, params: IParams, mysteryBoxEntity: MysteryBoxEntity): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      params,
      [
        ...mysteryBoxEntity.item.components.sort(sorter("id")).map(component => ({
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
          token: mysteryBoxEntity.template.contract.address,
          tokenId: mysteryBoxEntity.templateId.toString(),
          amount: "1",
        },
      ],
      mysteryBoxEntity.template.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
