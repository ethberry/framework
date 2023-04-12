import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { SettingsKeys } from "@framework/types";

import { SettingsEntity } from "./settings.entity";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingEntityRepository: Repository<SettingsEntity>,
  ) {}

  public search(): Promise<Array<SettingsEntity>> {
    return this.settingEntityRepository.find();
  }

  public async retrieve(): Promise<Record<SettingsKeys, any>> {
    const settingEntities = await this.search();
    return settingEntities.reduce(
      (memo, current) => Object.assign(memo, { [current.key]: current.value }),
      {} as Record<SettingsKeys, any>,
    );
  }

  public async retrieveByKey<T = any>(key: SettingsKeys): Promise<T> {
    const settings = await this.retrieve();
    return settings[key] as T;
  }
}
