import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlEventType,
  IAccessControlRoleAdminChanged,
  IAccessControlRoleGranted,
  IAccessControlRoleRevoked,
  TAccessControlEventData,
} from "@framework/types";

import { AccessControlHistoryService } from "./access-control-history/access-control-history.service";

@Injectable()
export class AccessControlServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly accessControlHistoryService: AccessControlHistoryService,
  ) {}

  public async roleGranted(event: ILogEvent<IAccessControlRoleGranted>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async roleRevoked(event: ILogEvent<IAccessControlRoleRevoked>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async roleAdminChanged(event: ILogEvent<IAccessControlRoleAdminChanged>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TAccessControlEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), AccessControlServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address } = context;

    await this.accessControlHistoryService.create({
      address,
      transactionHash,
      eventType: name as AccessControlEventType,
      eventData: args,
    });
  }
}
