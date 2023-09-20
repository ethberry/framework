import { Injectable } from "@nestjs/common";

import { ContractFeatures, ListenerType, ModuleType, TokenType } from "@framework/types";

import { ContractService } from "../hierarchy/contract/contract.service";
import { Erc20LogService } from "../tokens/erc20/token/log/log.service";
import { Erc721LogService } from "../tokens/erc721/token/log/log.service";
import { Erc998LogService } from "../tokens/erc998/token/log/log.service";
import { Erc1155LogService } from "../tokens/erc1155/token/log/log.service";
import { VestingLogService } from "../mechanics/vesting/log/vesting.log.service";
import { MysteryLogService } from "../mechanics/mystery/box/log/log.service";
import { PonziLogService } from "../mechanics/ponzi/log/log.service";
import { Erc721TokenRandomLogService } from "../tokens/erc721/token/log-random/log.service";
import { Erc998TokenRandomLogService } from "../tokens/erc998/token/log-random/log.service";
import { StakingLogService } from "../mechanics/staking/log/log.service";
import { LotteryLogService } from "../mechanics/lottery/log/log.service";
import { LotteryTicketLogService } from "../mechanics/lottery/ticket/log/log.service";
import { RaffleLogService } from "../mechanics/raffle/log/log.service";
import { RaffleTicketLogService } from "../mechanics/raffle/ticket/log/log.service";
import { WaitListLogService } from "../mechanics/wait-list/log/log.service";
import type { IEthLoggerInOutDto } from "./interfaces";

@Injectable()
export class ContractManagerServiceRmq {
  constructor(
    private readonly contractService: ContractService,
    private readonly erc20LogService: Erc20LogService,
    private readonly erc721LogService: Erc721LogService,
    private readonly erc721TokenRandomLogService: Erc721TokenRandomLogService,
    private readonly erc998LogService: Erc998LogService,
    private readonly erc998TokenRandomLogService: Erc998TokenRandomLogService,
    private readonly erc1155LogService: Erc1155LogService,
    private readonly mysteryLogService: MysteryLogService,
    private readonly vestingLogService: VestingLogService,
    private readonly stakingLogService: StakingLogService,
    private readonly ponziLogService: PonziLogService,
    private readonly lotteryLogService: LotteryLogService,
    private readonly lotteryTicketLogService: LotteryTicketLogService,
    private readonly raffleLogService: RaffleLogService,
    private readonly raffleTicketLogService: RaffleTicketLogService,
    private readonly waitListLogService: WaitListLogService,
  ) {}

  public async addListener(dto: IEthLoggerInOutDto): Promise<void> {
    const { address, listenerType, fromBlock } = dto;

    if (listenerType === ListenerType.ERC20) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC20);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.erc20LogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC721) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC721);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.erc721LogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC721_RANDOM) {
      const contracts = await this.contractService.findAllRandomTokensByType(TokenType.ERC721, [
        ContractFeatures.RANDOM,
        ContractFeatures.GENES,
      ]);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.erc721TokenRandomLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC998) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC998);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.erc998LogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC998_RANDOM) {
      const contracts = await this.contractService.findAllRandomTokensByType(TokenType.ERC998, [
        ContractFeatures.RANDOM,
        ContractFeatures.GENES,
      ]);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.erc998TokenRandomLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC1155) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC1155);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.erc1155LogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.MYSTERYBOX) {
      const contracts = await this.contractService.findAllByType([ModuleType.MYSTERY]);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.mysteryLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.VESTING) {
      const contracts = await this.contractService.findAllByType([ModuleType.VESTING]);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.vestingLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.STAKING) {
      const contracts = await this.contractService.findAllByType([ModuleType.STAKING]);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.stakingLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.PONZI) {
      const contracts = await this.contractService.findAllByType([ModuleType.PONZI]);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.ponziLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.LOTTERY) {
      const contracts = await this.contractService.findAllByType([ModuleType.LOTTERY], [ContractFeatures.RANDOM]);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.lotteryLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.LOTTERY_TICKET) {
      const contracts = await this.contractService.findAllByType([ModuleType.LOTTERY], []);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.lotteryTicketLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.RAFFLE) {
      const contracts = await this.contractService.findAllByType([ModuleType.RAFFLE], [ContractFeatures.RANDOM]);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.raffleLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.RAFFLE_TICKET) {
      const contracts = await this.contractService.findAllByType([ModuleType.RAFFLE], []);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.raffleTicketLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.WAITLIST) {
      const contracts = await this.contractService.findAllByType([ModuleType.WAITLIST]);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.waitListLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
  }

  public async removeListener(dto: IEthLoggerInOutDto): Promise<void> {
    const { address, listenerType, fromBlock } = dto;

    if (listenerType === ListenerType.ERC20) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC20);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.erc20LogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC721) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC721);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.erc721LogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC721_RANDOM) {
      const contracts = await this.contractService.findAllRandomTokensByType(TokenType.ERC721, [
        ContractFeatures.RANDOM,
        ContractFeatures.GENES,
      ]);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.erc721TokenRandomLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC998) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC998);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.erc998LogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC998_RANDOM) {
      const contracts = await this.contractService.findAllRandomTokensByType(TokenType.ERC998, [
        ContractFeatures.RANDOM,
        ContractFeatures.GENES,
      ]);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.erc998TokenRandomLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.ERC1155) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC1155);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.erc1155LogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.MYSTERYBOX) {
      const contracts = await this.contractService.findAllByType([ModuleType.MYSTERY]);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.mysteryLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.VESTING) {
      const contracts = await this.contractService.findAllByType([ModuleType.VESTING]);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.vestingLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.STAKING) {
      const contracts = await this.contractService.findAllByType([ModuleType.STAKING]);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.stakingLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.PONZI) {
      const contracts = await this.contractService.findAllByType([ModuleType.PONZI]);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.ponziLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }

    if (listenerType === ListenerType.LOTTERY) {
      const contracts = await this.contractService.findAllByType([ModuleType.LOTTERY], [ContractFeatures.RANDOM]);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.lotteryLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.LOTTERY_TICKET) {
      const contracts = await this.contractService.findAllByType([ModuleType.LOTTERY], []);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.lotteryTicketLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.RAFFLE) {
      const contracts = await this.contractService.findAllByType([ModuleType.RAFFLE], [ContractFeatures.RANDOM]);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.raffleLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.RAFFLE_TICKET) {
      const contracts = await this.contractService.findAllByType([ModuleType.RAFFLE], []);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.raffleTicketLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.WAITLIST) {
      const contracts = await this.contractService.findAllByType([ModuleType.WAITLIST]);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.waitListLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
  }
}
