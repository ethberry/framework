import {Injectable} from "@nestjs/common";
import {Request, Response} from "express";

import {IUser, UserStatus} from "@gemunionstudio/solo-types";

import {UserEntity} from "../user/user.entity";
import {IProfileUpdateDto} from "./interfaces";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class ProfileService {
  constructor(private readonly authService: AuthService) {}

  public async update(userEntity: UserEntity, data: IProfileUpdateDto, req: Request, res: Response): Promise<void> {
    const more: Partial<IUser> = {};
    const isEmailChanged = data.email && data.email !== userEntity.email;

    if (isEmailChanged) {
      more.userStatus = UserStatus.PENDING;
    }

    Object.assign(userEntity, data, more);
    await userEntity.save();

    if (isEmailChanged) {
      await this.authService.logout({user: userEntity});
      return;
    }

    res.json(userEntity);
  }
}
