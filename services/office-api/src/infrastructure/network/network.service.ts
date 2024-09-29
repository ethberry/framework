import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { INetwork } from "@ethberry/types-blockchain";

import { NetworkEntity } from "./network.entity";

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(NetworkEntity)
    private readonly networkEntityRepository: Repository<NetworkEntity>,
  ) {}

  public search(): Promise<Array<NetworkEntity>> {
    return this.networkEntityRepository.find();
  }

  public async retrieve(): Promise<Record<number, INetwork>> {
    const networkEntities = await this.search();
    return networkEntities.reduce(
      (memo, current) => Object.assign(memo, { [current.chainId]: { ...current } }),
      {} as Record<number, INetwork>,
    );
  }
}
