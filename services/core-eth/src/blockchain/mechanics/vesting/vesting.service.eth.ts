import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type {
  IErc1363TransferReceivedEvent,
  IOwnershipTransferredEvent,
  IVestingERC20ReleasedEvent,
  IVestingEtherReceivedEvent,
  IVestingEtherReleasedEvent,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { BalanceService } from "../../hierarchy/balance/balance.service";

@Injectable()
export class VestingServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
  ) {}

  public async erc20Released(event: ILogEvent<IVestingERC20ReleasedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async ethReleased(event: ILogEvent<IVestingEtherReleasedEvent>, context: Log): Promise<void> {
    const {
      args: { amount },
    } = event;
    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const tokenEntity = await this.tokenService.getToken("0", ZeroAddress.toLowerCase(), chainId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.decrement(tokenEntity.id, context.address.toLowerCase(), amount);
  }

  public async ethReceived(event: ILogEvent<IVestingEtherReceivedEvent>, context: Log): Promise<void> {
    const {
      args: { amount },
    } = event;
    await this.eventHistoryService.updateHistory(event, context);

    // get NATIVE token
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const tokenEntity = await this.tokenService.getToken("0", ZeroAddress, chainId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.increment(tokenEntity.id, context.address.toLowerCase(), amount);
  }

  public async transferReceived(event: ILogEvent<IErc1363TransferReceivedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async ownershipChanged(event: ILogEvent<IOwnershipTransferredEvent>, context: Log): Promise<void> {
    // history processed by AccessControlServiceEth
    // await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { newOwner, previousOwner },
    } = event;
    const { address } = context;

    const vestingEntity = await this.contractService.findOne({ address: address.toLowerCase() });
    if (!vestingEntity) {
      throw new NotFoundException("vestingNotFound");
    }

    const vestingParams = vestingEntity.parameters;
    if (vestingParams.account && vestingParams.account === previousOwner.toLowerCase()) {
      Object.assign(vestingParams, { account: newOwner.toLowerCase() });
      Object.assign(vestingEntity, { parameters: vestingParams });
      await vestingEntity.save();
    }
  }
}
