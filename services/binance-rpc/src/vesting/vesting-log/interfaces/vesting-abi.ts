import { FormatTypes, Interface } from "@ethersproject/abi";

import CliffVestingSol from "@framework/binance-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";
import GradedVestingSol from "@framework/binance-contracts/artifacts/contracts/Vesting/GradedVesting.sol/GradedVesting.json";
import LinearVestingSol from "@framework/binance-contracts/artifacts/contracts/Vesting/LinearVesting.sol/LinearVesting.json";

const iface1 = new Interface(CliffVestingSol.abi).format(FormatTypes.minimal) as Array<string>;
const iface2 = new Interface(GradedVestingSol.abi).format(FormatTypes.minimal) as Array<string>;
const iface3 = new Interface(LinearVestingSol.abi).format(FormatTypes.minimal) as Array<string>;

export const VestingAbi = [...new Set(iface1.concat(iface2).concat(iface3))];
