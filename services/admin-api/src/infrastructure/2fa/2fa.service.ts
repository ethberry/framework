import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import speakeasy from "@levminer/speakeasy";

import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";
import { I2FATokenDto } from "./interfaces";
import { TwoFAEntity } from "./2fa.entity";

@Injectable()
export class TwoFAService {
  constructor(
    @InjectRepository(TwoFAEntity)
    private readonly twoFAEntityRepository: Repository<TwoFAEntity>,
    private readonly userService: UserService,
  ) {}

  public async search(userEntity: UserEntity): Promise<Pick<TwoFAEntity, "isActive">> {
    let twoFAEntity = await this.twoFAEntityRepository.findOneBy({ userId: userEntity.id });

    if (!twoFAEntity) {
      twoFAEntity = await this.twoFAEntityRepository
        .create({ userId: userEntity.id, isActive: false, secret: "", endTimestamp: null })
        .save();
    }

    return twoFAEntity.save().then(({ isActive }) => ({ isActive }));
  }

  public async activate(userEntity: UserEntity): Promise<Pick<TwoFAEntity, "isActive">> {
    const { base32: secret } = speakeasy.generateSecret({ name: userEntity.sub });

    let twoFAEntity = await this.twoFAEntityRepository.findOneBy({ userId: userEntity.id });

    if (!twoFAEntity) {
      twoFAEntity = await this.twoFAEntityRepository.create({ userId: userEntity.id }).save();
    }

    Object.assign(twoFAEntity, {
      isActive: true,
      secret,
      endTimestamp: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    });

    return twoFAEntity.save().then(({ isActive }) => ({ isActive }));
  }

  public async deactivate(userEntity: UserEntity): Promise<Pick<TwoFAEntity, "isActive">> {
    const twoFAEntity = await this.twoFAEntityRepository.findOneBy({ userId: userEntity.id });

    if (!twoFAEntity) {
      return { isActive: false };
    }

    Object.assign(twoFAEntity, { isActive: false, secret: null });
    await twoFAEntity.save();

    return { isActive: twoFAEntity.isActive };
  }

  public async verify(dto: I2FATokenDto, userEntity: UserEntity): Promise<boolean> {
    const { token } = dto;

    const twoFAEntity = await this.twoFAEntityRepository.findOneBy({ userId: userEntity.id });

    if (!twoFAEntity) {
      return false;
    }

    return speakeasy.totp.verify({
      secret: twoFAEntity.secret as string,
      encoding: "base32",
      token,
      window: 6,
    });
  }
}
