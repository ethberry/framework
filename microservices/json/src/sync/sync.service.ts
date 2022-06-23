import { Injectable, NotFoundException } from "@nestjs/common";

import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class SyncService {
  constructor(private readonly userService: UserService) {}

  public async getProfileBySub(sub: string): Promise<UserEntity> {
    const userEntity = await this.userService.findOne({ sub });

    if (!userEntity) {
      throw new NotFoundException("userNotFound");
    }

    return userEntity;
  }
}
