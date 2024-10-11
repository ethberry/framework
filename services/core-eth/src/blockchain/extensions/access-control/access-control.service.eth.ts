import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IAccessControlRoleAdminChangedEvent,
  IAccessControlRoleGrantedEvent,
  IAccessControlRoleRevokedEvent,
  IContractManagerERC20TokenDeployedEvent,
  IOwnershipTransferredEvent,
} from "@framework/types";
import {
  AccessControlRoleHash,
  AccessControlRoleType,
  ContractStatus,
  ModuleType,
  RmqProviderType,
  SignalEventType,
} from "@framework/types";

import { AccessControlService } from "./access-control.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { testChainId } from "@framework/constants";
import { AccessControlServiceLog } from "./access-control.service.log";

@Injectable()
export class AccessControlServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly accessControlService: AccessControlService,
    private readonly contractService: ContractService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly configService: ConfigService,
    private readonly accessControlServiceLog: AccessControlServiceLog,
  ) {}

  public async roleGranted(event: ILogEvent<IAccessControlRoleGrantedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { role, account },
    } = event;

    const { address, transactionHash } = context;

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.accessControlService.create({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      role: Object.values(AccessControlRoleType)[
        Object.values(AccessControlRoleHash).indexOf(role as AccessControlRoleHash)
      ],
    });

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractManagerEntity = await this.contractService.findOne({
      contractModule: ModuleType.CONTRACT_MANAGER,
      chainId,
    });
    const exchnageEntity = await this.contractService.findOne({
      contractModule: ModuleType.EXCHANGE,
      chainId,
    });

    if (
      account.toLowerCase() !== contractManagerEntity!.address.toLowerCase() &&
      account.toLowerCase() !== exchnageEntity!.address.toLowerCase() &&
      account.toLowerCase() !== ZeroAddress
    ) {
      await this.signalClientProxy
        .emit(SignalEventType.TRANSACTION_HASH, {
          account: contractEntity.merchant.wallet.toLowerCase(),
          transactionHash,
          transactionType: name,
        })
        .toPromise();
    }
  }

  public async roleRevoked(event: ILogEvent<IAccessControlRoleRevokedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { role, account },
    } = event;
    const { address, transactionHash } = context;

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.accessControlService.delete({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      role: Object.values(AccessControlRoleType)[
        Object.values(AccessControlRoleHash).indexOf(role as AccessControlRoleHash)
      ],
    });

    await this.eventHistoryService.updateHistory(event, context);

    if (role === AccessControlRoleHash.MINTER_ROLE.toString()) {
      const systemContractEntity = await this.contractService.findOne({ address: account.toLowerCase() });
      if (!systemContractEntity) {
        throw new NotFoundException("contractNotFound");
      }
      // if revoked from Exchange - make contract inactive
      if (systemContractEntity.contractModule === ModuleType.EXCHANGE) {
        const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

        if (!contractEntity) {
          throw new NotFoundException("contractNotFound");
        }
        Object.assign(contractEntity, { contractStatus: ContractStatus.INACTIVE });
        await contractEntity.save();
      }
    }

    const chainId = this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractManagerEntity = await this.contractService.findOne({
      contractModule: ModuleType.CONTRACT_MANAGER,
      chainId,
    });
    const exchnageEntity = await this.contractService.findOne({
      contractModule: ModuleType.EXCHANGE,
      chainId,
    });

    if (
      account.toLowerCase() !== contractManagerEntity!.address.toLowerCase() &&
      account.toLowerCase() !== exchnageEntity!.address.toLowerCase() &&
      account.toLowerCase() !== ZeroAddress
    ) {
      await this.signalClientProxy
        .emit(SignalEventType.TRANSACTION_HASH, {
          account: contractEntity.merchant.wallet.toLowerCase(),
          transactionHash,
          transactionType: name,
        })
        .toPromise();
    }
  }

  public async roleAdminChanged(event: ILogEvent<IAccessControlRoleAdminChangedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { previousAdminRole },
    } = event;
    const { address, transactionHash } = context;

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractManagerEntity = await this.contractService.findOne({
      contractModule: ModuleType.CONTRACT_MANAGER,
      chainId,
    });
    const exchnageEntity = await this.contractService.findOne({
      contractModule: ModuleType.EXCHANGE,
      chainId,
    });

    if (
      previousAdminRole.toLowerCase() !== contractManagerEntity!.address.toLowerCase() &&
      previousAdminRole.toLowerCase() !== exchnageEntity!.address.toLowerCase() &&
      previousAdminRole.toLowerCase() !== ZeroAddress
    ) {
      await this.signalClientProxy
        .emit(SignalEventType.TRANSACTION_HASH, {
          account: contractEntity.merchant.wallet.toLowerCase(),
          transactionHash,
          transactionType: name,
        })
        .toPromise();
    }
  }

  public async ownershipTransferred(event: ILogEvent<IOwnershipTransferredEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { newOwner, previousOwner },
    } = event;

    const { address, transactionHash } = context;

    const contractEntity = await this.contractService.findOne(
      { address: address.toLowerCase() },
      { relations: { merchant: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.accessControlService.delete({
      address: context.address.toLowerCase(),
      account: previousOwner.toLowerCase(),
      role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
    });

    await this.accessControlService.create({
      address: context.address.toLowerCase(),
      account: newOwner.toLowerCase(),
      role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
    });

    await this.eventHistoryService.updateHistory(event, context);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: contractEntity.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async deploy(event: ILogEvent<IContractManagerERC20TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    await this.accessControlServiceLog.updateRegistryAndReadBlock(
      [account.toLowerCase()],
      parseInt(context.blockNumber.toString(), 16),
    );
  }
}
