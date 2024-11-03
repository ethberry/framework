import { Injectable, NotFoundException } from "@nestjs/common";
import { AbiCoder, encodeBytes32String, hexlify, keccak256, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature, ISignatureParams } from "@ethberry/types-blockchain";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { IVestingBoxSignDto, VestingType, ModuleType, SettingsKeys, TokenType } from "@framework/types";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { VestingBoxService } from "../box/box.service";
import { VestingBoxEntity } from "../box/box.entity";

@Injectable()
export class VestingSignService {
  constructor(
    private readonly vestingBoxService: VestingBoxService,
    private readonly contractService: ContractService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: IVestingBoxSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, vestingBoxId } = dto;

    const vestingBoxEntity = await this.vestingBoxService.findOneWithRelations({ id: vestingBoxId });

    if (!vestingBoxEntity) {
      throw new NotFoundException("vestingBoxNotFound");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;

    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId: userEntity.chainId }),
      userEntity.wallet,
      {
        externalId: vestingBoxEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: vestingBoxEntity.template.contract.merchant.wallet,
        referrer,
      },
      vestingBoxEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: ISignatureParams,
    vestingBoxEntity: VestingBoxEntity,
  ): Promise<string> {
    const content = convertDatabaseAssetToChainAsset(vestingBoxEntity.content.components);
    const price = convertDatabaseAssetToChainAsset(vestingBoxEntity.template.price.components);

    return this.signerService.getOneToManyToManySignature(
      verifyingContract,
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
        token: vestingBoxEntity.template.contract.address,
        tokenId: vestingBoxEntity.templateId.toString(),
        amount: "1",
      },
      price,
      content,
      keccak256(
        AbiCoder.defaultAbiCoder().encode(
          ["uint8", "uint128", "uint64", "uint64", "uint64", "uint16", "uint16"],
          [
            Object.values(VestingType).indexOf(vestingBoxEntity.shape.split("_")[0] as VestingType),
            vestingBoxEntity.cliff,
            new Date(vestingBoxEntity.startTimestamp).getTime(),
            vestingBoxEntity.duration,
            vestingBoxEntity.period,
            vestingBoxEntity.afterCliffBasisPoints,
            vestingBoxEntity.growthRate,
          ],
        ),
      ),
    );
  }
}
