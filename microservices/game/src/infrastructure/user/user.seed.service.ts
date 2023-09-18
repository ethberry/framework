import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { generateTestUser } from "../../test";
import { UserEntity } from "./user.entity";

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
