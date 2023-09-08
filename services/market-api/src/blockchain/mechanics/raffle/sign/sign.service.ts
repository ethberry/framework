import { Injectable, NotFoundException } from "@nestjs/common";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { ModuleType, TokenType } from "@framework/types";

import type { ISignRaffleDto } from "./interfaces";
import { RaffleRoundService } from "../round/round.service";
import { RaffleRoundEntity } from "../round/round.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Injectable()
export class RaffleSignService {
  constructor(
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly roundService: RaffleRoundService,
  ) {}

  public async sign(dto: ISignRaffleDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, contractId, chainId } = dto;

    const raffleRoundEntity = await this.roundService.findCurrentRoundWithRelations(contractId);

    if (!raffleRoundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    const nonce = randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
      {
        externalId: raffleRoundEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
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
    params: IParams,
    roundEntity: RaffleRoundEntity,
  ): Promise<string> {
    return this.signerService.getOneToOneSignature(
      verifyingContract,
      account,
      params,
      {
        tokenType: 2,
        token: roundEntity.ticketContract.address,
        tokenId: "0",
        amount: "1",
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
