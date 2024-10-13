import { Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, ZeroAddress, ZeroHash } from "ethers";

import type { IServerSignature, ISignatureParams } from "@ethberry/types-blockchain";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import type { IRaffleSignDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { RaffleRoundService } from "../round/round.service";
import { RaffleRoundEntity } from "../round/round.entity";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@Injectable()
export class RaffleSignService {
  constructor(
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly roundService: RaffleRoundService,
  ) {}

  public async sign(dto: IRaffleSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, contractId } = dto;

    const raffleRoundEntity = await this.roundService.findCurrentRoundWithRelations(contractId);

    if (!raffleRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    const nonce = randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({
        contractModule: ModuleType.EXCHANGE,
        chainId: raffleRoundEntity.contract.chainId,
      }),
      userEntity.wallet,
      {
        externalId: raffleRoundEntity.id,
        expiresAt,
        nonce,
        extra: ZeroHash,
        receiver: raffleRoundEntity.contract.address,
        referrer,
      },
      raffleRoundEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: ISignatureParams,
    roundEntity: RaffleRoundEntity,
  ): Promise<string> {
    return this.signerService.getOneToOneSignature(
      verifyingContract,
      account,
      params,
      {
        tokenType: 2,
        token: roundEntity.ticketContract.address,
        tokenId: 0n,
        amount: 1n,
      },
      {
        tokenType: Object.values(TokenType).indexOf(roundEntity.price.components[0].tokenType),
        token: roundEntity.price.components[0].contract.address,
        tokenId: roundEntity.price.components[0].template.tokens[0].tokenId,
        amount: roundEntity.price.components[0].amount,
      },
    );
  }
}
