import { Injectable } from "@nestjs/common";

import { UserStatus } from "@gemunionstudio/framework-types";

import { UserEntity } from "../user/user.entity";
import { IProfileUpdateDto } from "./interfaces";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";

@Injectable()
export class ProfileService {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  public async update(userEntity: UserEntity, dto: IProfileUpdateDto): Promise<UserEntity | undefined> {
    const { email, password, ...rest } = dto;

    if (email) {
      await this.userService.checkEmail(email, userEntity.id);
      if (email !== userEntity.email) {
        userEntity.userStatus = UserStatus.PENDING;
        userEntity.email = email;
      }
    }

    if (password) {
      userEntity.password = this.userService.createPasswordHash(password);
    }

    Object.assign(userEntity, rest);
    await userEntity.save();

    if (userEntity.userStatus === UserStatus.PENDING) {
      await this.authService.logout({ user: userEntity });
      return;
    }

    return userEntity;
  }
}
