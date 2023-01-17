import { Injectable, NotFoundException } from "@nestjs/common";
import { wallet } from "@gemunion/constants";

import { BalanceService } from "../hierarchy/balance/balance.service";
import { BalanceEntity } from "../hierarchy/balance/balance.entity";
import { IBalanceSearchDto, ModuleType } from "@framework/types";
import { ContractService } from "../hierarchy/contract/contract.service";

@Injectable()
export class WalletService {
  constructor(protected readonly balanceService: BalanceService, protected readonly contractService: ContractService) {}

  public async getWalletBalance(dto: IBalanceSearchDto): Promise<[Array<BalanceEntity>, number]> {
    const contractExchangeEntity = await this.contractService.findOne({
      contractModule: ModuleType.SYSTEM,
      title: "EXCHANGE",
    });

    if (!contractExchangeEntity) {
      throw new NotFoundException("contractExchangeNotFound");
    }

    // MODULE:PYRAMID
    const contractPyramidEntities = await this.contractService.findAll({
      contractModule: ModuleType.PYRAMID,
    });

    if (!contractPyramidEntities) {
      throw new NotFoundException("contractsPyramidNotFound");
    }

    const accounts = contractPyramidEntities.map(contract => contract.address).filter(c => c !== wallet);
    accounts.push(contractExchangeEntity.address);

    Object.assign(dto, { accounts }); // todo add to dto.accounts
    // return this.balanceService.search(dto, contractExchangeEntity.address);
    const balances = await this.balanceService.search(dto);
    return balances;
  }
}
