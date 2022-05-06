import { BadRequestException, Injectable } from "@nestjs/common";
import { IMetamaskDto, MetamaskService } from "@gemunion/nest-js-module-metamask";

import { UserEntity } from "../user/user.entity";
import { IProfileUpdateDto } from "./interfaces";

@Injectable()
export class ProfileService {
  constructor(private readonly metamaskService: MetamaskService) {}

  public update(userEntity: UserEntity, dto: IProfileUpdateDto): Promise<UserEntity> {
    Object.assign(userEntity, dto);
    return userEntity.save();
  }

  public attach(userEntity: UserEntity, dto: IMetamaskDto): Promise<UserEntity> {
    const { signature, wallet, nonce } = dto;

    if (!this.metamaskService.isValidSignature({ signature, wallet: wallet.toLowerCase(), nonce })) {
      throw new BadRequestException("signatureDoesNotMatch");
    }

    Object.assign(userEntity, { wallet });
    return userEntity.save();
  }
}
