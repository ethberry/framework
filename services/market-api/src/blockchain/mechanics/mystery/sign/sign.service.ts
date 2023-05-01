import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BigNumber, constants, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IAsset, IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { SettingsKeys, TokenType } from "@framework/types";

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
    const { account, referrer = constants.AddressZero, mysteryboxId } = dto;

    const mysteryboxEntity = await this.mysteryBoxService.findOneWithRelations({ id: mysteryboxId });

    if (!mysteryboxEntity) {
      throw new NotFoundException("mysteryboxNotFound");
    }

    const cap = BigNumber.from(mysteryboxEntity.template.cap);
    if (cap.gt(0) && cap.lte(mysteryboxEntity.template.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = utils.randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;

    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: mysteryboxEntity.id,
        expiresAt,
        referrer,
        extra: utils.formatBytes32String("0x"),
      },
      mysteryboxEntity,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, mysteryboxEntity: MysteryBoxEntity): Promise<string> {
    const items = ([] as Array<IAsset>).concat(
      mysteryboxEntity.item.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.templateId.toString(),
        amount: component.amount,
      })),
      [
        {
          tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
          token: mysteryboxEntity.template.contract.address,
          tokenId: mysteryboxEntity.templateId.toString(),
          amount: "1",
        },
      ],
    );

    return this.signerService.getManyToManySignature(
      account,
      params,
      items,
      mysteryboxEntity.template.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
