import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { BigNumber } from "ethers";

@Injectable()
export class BigNumberPipe implements PipeTransform<string> {
  transform(value: string): BigNumber {
    try {
      return BigNumber.from(value);
    } catch (_e) {
      throw new BadRequestException(`Validation failed (BigNumber is expected)`);
    }
  }
}
