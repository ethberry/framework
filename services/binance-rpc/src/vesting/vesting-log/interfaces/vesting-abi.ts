import { Interface, FormatTypes } from "@ethersproject/abi";

import cliffVest from "@framework/binance-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";
import gradedVest from "@framework/binance-contracts/artifacts/contracts/Vesting/GradedVesting.sol/GradedVesting.json";
import linearVest from "@framework/binance-contracts/artifacts/contracts/Vesting/LinearVesting.sol/LinearVesting.json";

const iface1 = new Interface(cliffVest.abi).format(FormatTypes.minimal) as Array<string>;
const iface2 = new Interface(gradedVest.abi).format(FormatTypes.minimal) as Array<string>;
const iface3 = new Interface(linearVest.abi).format(FormatTypes.minimal) as Array<string>;

export const VestingAbi = [...new Set(iface1.concat(iface2).concat(iface3))];
