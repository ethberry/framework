import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ethers } from "ethers";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc1155TokenEventType,
  IErc1155TokenApprovalForAll,
  IErc1155TokenTransferBatch,
  IErc1155TokenTransferSingle,
  IErc1155TokenUri,
  TErc1155TokenEventData,
} from "@framework/types";

import { Erc1155TokenHistoryService } from "../token-history/token-history.service";
import { Erc1155BalanceService } from "../balance/balance.service";
import { Erc1155TokenService } from "./token.service";

@Injectable()
export class Erc1155TokenServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc1155TokenHistoryService: Erc1155TokenHistoryService,
    private readonly erc1155BalanceService: Erc1155BalanceService,
    private readonly erc1155TokenService: Erc1155TokenService,
  ) {}

  public async transferSingle(event: IEvent<IErc1155TokenTransferSingle>): Promise<void> {
    const {
      address,
      returnValues: { from, to, id, value },
    } = event;

    await this.updateHistory(event);

    await this.updateBalances(from.toLowerCase(), to.toLowerCase(), address.toLowerCase(), id, ~~value);
  }

  public async transferBatch(event: IEvent<IErc1155TokenTransferBatch>): Promise<void> {
    const {
      address,
      returnValues: { from, to, ids, values },
    } = event;

    await this.updateHistory(event);

    await Promise.all(
      ids.map((tokenId, i) =>
        this.updateBalances(from.toLowerCase(), to.toLowerCase(), address.toLowerCase(), tokenId, ~~values[i]),
      ),
    );
  }

  public async approvalForAll(event: IEvent<IErc1155TokenApprovalForAll>): Promise<void> {
    await this.updateHistory(event);
  }

  public async uri(event: IEvent<IErc1155TokenUri>): Promise<void> {
    await this.updateHistory(event);
  }

  private async updateBalances(from: string, to: string, address: string, tokenId: string, amount: number) {
    const erc1155TokenEntity = await this.erc1155TokenService.getToken(tokenId, address);

    if (!erc1155TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (from !== ethers.constants.AddressZero) {
      erc1155TokenEntity.instanceCount += amount;
      await this.erc1155BalanceService.decrement(erc1155TokenEntity.id, from, amount);
    }

    if (to !== ethers.constants.AddressZero) {
      // erc1155TokenEntity.instanceCount -= amount;
      await this.erc1155BalanceService.increment(erc1155TokenEntity.id, to, amount);
    }
  }

  private async updateHistory(event: IEvent<TErc1155TokenEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc1155TokenServiceWs.name);

    const { returnValues, event: eventType, transactionHash, address } = event;

    await this.erc1155TokenHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: eventType as Erc1155TokenEventType,
      eventData: returnValues,
    });
  }
}
