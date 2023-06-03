import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ListenerType, ModuleType, TokenType } from "@framework/types";
import { ContractService } from "../hierarchy/contract/contract.service";
import { IEthLoggerInOutDto } from "./interfaces";
import { Erc20LogService } from "../tokens/erc20/token/log/log.service";
import { Erc721TokenLogService } from "../tokens/erc721/token/log/log.service";
import { Erc998TokenLogService } from "../tokens/erc998/token/log/log.service";
import { Erc1155LogService } from "../tokens/erc1155/token/log/log.service";
import { VestingLogService } from "../mechanics/vesting/log/vesting.log.service";
import { MysteryLogService } from "../mechanics/mystery/box/log/log.service";
import { PyramidLogService } from "../mechanics/pyramid/log/log.service";

@Injectable()
export class ContractManagerServiceRmq {
  constructor(
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly erc20LogService: Erc20LogService,
    private readonly erc721LogService: Erc721TokenLogService,
    private readonly erc998LogService: Erc998TokenLogService,
    private readonly erc1155LogService: Erc1155LogService,
    private readonly mysteryLogService: MysteryLogService,
    private readonly pyramidLogService: PyramidLogService,
    private readonly vestingLogService: VestingLogService,
  ) {}

  public async loggerIn(dto: IEthLoggerInOutDto): Promise<void> {
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
    if (listenerType === ListenerType.ERC998) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC998);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.erc998LogService.addListener({
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
      const contracts = await this.contractService.findAllByType(ModuleType.MYSTERY);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.mysteryLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.PYRAMID) {
      const contracts = await this.contractService.findAllByType(ModuleType.PYRAMID);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.pyramidLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.VESTING) {
      const contracts = await this.contractService.findAllByType(ModuleType.VESTING);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.vestingLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.STAKING) {
      const contracts = await this.contractService.findAllByType(ModuleType.STAKING);
      contracts.address = contracts.address ? contracts.address.concat([address]) : [address];
      const unique = [...new Set(contracts.address)];
      this.vestingLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
  }

  public async loggerOut(dto: IEthLoggerInOutDto): Promise<void> {
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
    if (listenerType === ListenerType.ERC998) {
      const contracts = await this.contractService.findAllTokensByType(TokenType.ERC998);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.erc998LogService.addListener({
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
      const contracts = await this.contractService.findAllByType(ModuleType.MYSTERY);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.mysteryLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.PYRAMID) {
      const contracts = await this.contractService.findAllByType(ModuleType.PYRAMID);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.pyramidLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
    if (listenerType === ListenerType.VESTING) {
      const contracts = await this.contractService.findAllByType(ModuleType.VESTING);
      contracts.address = contracts.address ? contracts.address.filter(c => c !== address) : [];
      const unique = [...new Set(contracts.address)];
      this.vestingLogService.addListener({
        address: unique,
        fromBlock: Math.max(fromBlock || 1, contracts.fromBlock || 1),
      });
    }
  }
}
