import { Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature, ISignatureParams } from "@ethberry/types-blockchain";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { ModuleType, TokenType, ILotterySignDto } from "@framework/types";

import { LotteryRoundService } from "../round/round.service";
import { LotteryRoundEntity } from "../round/round.entity";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@Injectable()
export class LotterySignService {
  constructor(
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly roundService: LotteryRoundService,
  ) {}

  public async sign(dto: ILotterySignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, ticketNumbers, contractId } = dto;
    const lotteryRound = await this.roundService.findCurrentRoundWithRelations(contractId);

    if (!lotteryRound) {
      throw new NotFoundException("roundNotFound");
    }

    const nonce = randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId: userEntity.chainId }),
      userEntity.wallet,
      {
        externalId: lotteryRound.id,
        expiresAt,
        nonce,
        extra: ticketNumbers, // encoded string from ui
        receiver: lotteryRound.contract.address,
        referrer,
      },
      lotteryRound,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: ISignatureParams,
    roundEntity: LotteryRoundEntity,
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
