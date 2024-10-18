import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { UserService } from "../../infrastructure/user/user.service";

@Injectable()
export class ContractManagerServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    protected readonly userService: UserService,
  ) {}

  public async getMerchantId(userId: number): Promise<number> {
    const userEntity = await this.userService.findOne({ id: userId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.merchantId;
  }

  public async getUserWalletById(userId: number): Promise<string> {
    const userEntity = await this.userService.findOne({ id: userId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.wallet;
  }
}
