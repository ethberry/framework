import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "./user.entity";
import { EnabledLanguages, imageUrl } from "@framework/constants";
import { IUser, UserRole, UserStatus } from "@framework/types";

export const generateTestUser = (data: Partial<IUser> = {}): Partial<IUser> => {
  return Object.assign(
    {
      language: EnabledLanguages.EN,
      userRoles: [UserRole.USER],
      userStatus: UserStatus.ACTIVE,
      displayName: "Trej",
      imageUrl,
      comment: "Fraud!",
    },
    data,
  );
};

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  public async setup(): Promise<any> {
    const user1 = await this.userEntityRepository.create(generateTestUser()).save();

    return {
      users: [user1],
    };
  }

  public async tearDown(): Promise<void> {
    await this.userEntityRepository.delete({});
  }
}
