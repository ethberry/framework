import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlEventType,
  AccessControlRoleHash,
  IAccessControlRoleAdminChanged,
  IAccessControlRoleGranted,
  IAccessControlRoleRevoked,
  TAccessControlEventData,
} from "@framework/types";

import { AccessControlHistoryService } from "./history/history.service";
import { AccessControlService } from "./access-control.service";
import { ContractService } from "../hierarchy/contract/contract.service";

@Injectable()
export class AccessControlServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly accessControlService: AccessControlService,
    private readonly accessControlHistoryService: AccessControlHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async roleGranted(event: ILogEvent<IAccessControlRoleGranted>, context: Log): Promise<void> {
    const {
      args: { role, account },
    } = event;

    await this.updateHistory(event, context);

    await this.accessControlService.create({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      role: Object.keys(AccessControlRoleHash)[
        Object.values(AccessControlRoleHash).indexOf(role as AccessControlRoleHash)
      ] as AccessControlRoleHash,
    });
  }

  public async roleRevoked(event: ILogEvent<IAccessControlRoleRevoked>, context: Log): Promise<void> {
    const {
      args: { role, account },
    } = event;

    await this.updateHistory(event, context);

    await this.accessControlService.delete({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      role: Object.keys(AccessControlRoleHash)[
        Object.values(AccessControlRoleHash).indexOf(role as AccessControlRoleHash)
      ] as AccessControlRoleHash,
    });
  }

  public async roleAdminChanged(event: ILogEvent<IAccessControlRoleAdminChanged>, context: Log): Promise<void> {
    const {
      args: { role, newAdminRole },
    } = event;

    await this.updateHistory(event, context);

    await this.accessControlService.create({
      address: context.address.toLowerCase(),
      account: newAdminRole.toLowerCase(),
      role: Object.keys(AccessControlRoleHash)[
        Object.values(AccessControlRoleHash).indexOf(role as AccessControlRoleHash)
      ] as AccessControlRoleHash,
    });
  }

  private async updateHistory(event: ILogEvent<TAccessControlEventData>, context: Log) {
    this.loggerService.log(
      JSON.stringify(
        {
          name: event.name,
          signature: event.signature,
          topic: event.topic,
          args: event.args,
          address: context.address,
          transactionIndex: context.transactionIndex,
          transactionHash: context.transactionHash,
          blockNumber: context.blockNumber,
        },
        null,
        "\t",
      ),
      AccessControlServiceEth.name,
    );

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.accessControlHistoryService.create({
      address,
      transactionHash,
      eventType: name as AccessControlEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(
      address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
