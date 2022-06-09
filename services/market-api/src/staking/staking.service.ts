import { Injectable } from "@nestjs/common";

@Injectable()
export class StakingService {
  public search(): Promise<[Array<any>, number]> {
    return Promise.resolve([[], 0]);
  }
}
