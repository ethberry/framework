import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BigNumber, utils } from "ethers";

import { IServerSignature } from "@gemunion/types-collection";
import { TokenType } from "@framework/types";
import { IAsset, IParams, SignerService } from "@gemunion/nest-js-module-exchange-signer";

import { ISignMysteryboxDto } from "./interfaces";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { MysteryboxBoxService } from "../box/box.service";
import { MysteryboxBoxEntity } from "../box/box.entity";

@Injectable()
export class MysteryboxSignService {
  constructor(
    private readonly mysteryboxBoxService: MysteryboxBoxService,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
  ) {}

  public async sign(dto: ISignMysteryboxDto): Promise<IServerSignature> {
    const { mysteryboxId, account, referrer } = dto;

    const mysteryboxEntity = await this.mysteryboxBoxService.findOneWithRelations({ id: mysteryboxId });

    if (!mysteryboxEntity) {
      throw new NotFoundException("mysteryboxNotFound");
    }

    const cap = BigNumber.from(mysteryboxEntity.template.cap);
    if (cap.gt(0) && cap.lte(mysteryboxEntity.template.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: mysteryboxEntity.id,
        expiresAt,
        referrer,
      },
      mysteryboxEntity,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, mysteryboxEntity: MysteryboxBoxEntity): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      params,
      ([] as Array<IAsset>).concat(
        mysteryboxEntity.item.components.map(component => ({
          tokenType: Object.keys(TokenType).indexOf(component.tokenType),
          token: component.contract.address,
          tokenId: component.templateId.toString(),
          amount: component.amount,
        })),
        {
          tokenType: Object.keys(TokenType).indexOf(TokenType.ERC721),
          token: mysteryboxEntity.template.contract.address,
          tokenId: mysteryboxEntity.id.toString(),
          amount: "1",
        },
      ),
      mysteryboxEntity.template.price.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
