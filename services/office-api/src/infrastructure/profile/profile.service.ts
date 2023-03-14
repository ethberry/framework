import { Injectable } from "@nestjs/common";

import { UserEntity } from "../user/user.entity";
import { IProfileUpdateDto } from "./interfaces";

@Injectable()
export class ProfileService {
  public update(userEntity: UserEntity, dto: IProfileUpdateDto): Promise<UserEntity> {
    Object.assign(userEntity, dto);
    return userEntity.save();
  }
}
