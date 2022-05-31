import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc20TokenEventType,
  IAccessControlRoleAdminChanged,
  IErc20RoleGrant,
  IErc20TokenApprove,
  IErc20TokenSnapshot,
  IErc20TokenTransfer,
  TErc20TokenEventData,
} from "@framework/types";

import { Erc20TokenHistoryService } from "../token-history/token-history.service";

@Injectable()
export class Erc20TokenServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc20TokenHistoryService: Erc20TokenHistoryService,
  ) {}

  public async transfer(event: ILogEvent<IErc20TokenTransfer>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async approval(event: ILogEvent<IErc20TokenApprove>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async snapshot(event: ILogEvent<IErc20TokenSnapshot>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async roleGrant(event: ILogEvent<IErc20RoleGrant>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async roleRevoke(event: ILogEvent<IErc20RoleGrant>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  // TODO move to AccessControl-eth?
  public async roleAdmin(event: ILogEvent<IAccessControlRoleAdminChanged>, context: Log): Promise<void> {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc20TokenServiceEth.name);
    // await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc20TokenEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc20TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address } = context;

    await this.erc20TokenHistoryService.create({
      address,
      transactionHash,
      eventType: name as Erc20TokenEventType,
      eventData: args,
    });
  }
}
