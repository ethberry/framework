import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ChainIdPipe implements PipeTransform<string> {
  transform(value: string): number {
    try {
      BigInt(value);
      return Number(value);
    } catch (_e) {
      throw new BadRequestException(`Validation failed (ChainId is expected)`);
    }
  }
}
