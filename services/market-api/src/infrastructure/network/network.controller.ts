import { Controller, Get } from "@nestjs/common";

import { INetwork } from "@ethberry/types-blockchain";
import { Public } from "@ethberry/nest-js-utils";

import { NetworkService } from "./network.service";

@Public()
@Controller("/network")
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get("/")
  public retrieve(): Promise<Record<number, INetwork>> {
    return this.networkService.retrieve();
  }
}
