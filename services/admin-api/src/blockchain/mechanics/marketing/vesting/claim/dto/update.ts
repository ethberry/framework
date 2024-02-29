import type { IVestingClaimUpdateDto } from "../interfaces";
import { VestingClaimCreateDto } from "./create";

export class VestingClaimUpdateDto extends VestingClaimCreateDto implements IVestingClaimUpdateDto {}
