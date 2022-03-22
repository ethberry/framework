import { Injectable, UnauthorizedException } from "@nestjs/common";

import { UserStatus } from "@gemunion/framework-types";

import { UserEntity } from "../user/user.entity";
import { IPasswordUpdateDto, IProfileUpdateDto } from "./interfaces";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";

@Injectable()
export class ProfileService {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  public async update(userEntity: UserEntity, dto: IProfileUpdateDto): Promise<UserEntity | null> {
    const { email, ...rest } = dto;

    if (email) {
      await this.userService.checkEmail(email, userEntity.id);
      if (email !== userEntity.email) {
        userEntity.userStatus = UserStatus.PENDING;
        userEntity.email = email;
      }
    }

    Object.assign(userEntity, rest);
    await userEntity.save();

    if (userEntity.userStatus === UserStatus.PENDING) {
      await this.authService.logout({ userId: userEntity.id });
      return null;
    }

    return userEntity;
  }

  public async password(userEntity: UserEntity, dto: IPasswordUpdateDto): Promise<void> {
    const { password, current } = dto;

    const user = await this.userService.findOne({
      email: userEntity.email,
      password: current ? this.userService.createPasswordHash(current) : "",
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (password) {
      userEntity.password = this.userService.createPasswordHash(password);
      await this.userService.checkPasswordIsDifferent(userEntity.id, userEntity.password);
    }

    await userEntity.save();

    await this.authService.logout({ userId: userEntity.id });
  }
}
