import { task, types } from "hardhat/config";
import fs from "fs";
import path from "path";

export interface IAbiObj {
  name: string;
  type: string;
}

export interface IArtifact {
  abi: Array<IAbiObj>;
}

// LIST OF FUNCTIONS WE NEED TO INCLUDE TO PAC
export const fwFunctionNames = [
  "addConsumer",
  "approve",
  "balanceOf",
  "blacklist",
  "breed",
  "claim",
  "craft",
  "createSubscription",
  "deployCollection",
  "deployERC1155Token",
  "deployERC20Token",
  "deployERC721Token",
  "deployERC998Token",
  "deployLottery",
  "deployMysterybox",
  "deployPaymentSplitter",
  "deployPonzi",
  "deployRaffle",
  "deployStaking",
  "deployVesting",
  "deployWaitList",
  "deposit",
  "dismantle",
  "disperse",
  "endRound",
  "getERC20",
  "getPenalty",
  "getPrize",
  "getSubscription",
  "grantRole",
  "lend",
  "mint",
  "mintBox",
  "mintCommon",
  "pause",
  "purchase",
  "purchaseLottery",
  "purchaseMystery",
  "purchaseRaffle",
  "receiveReward",
  "releasable",
  "release",
  "releaseFunds",
  "renounceRole",
  "revokeRole",
  "safeTransferChild",
  "safeTransferFrom",
  "safeTransferFromERC1155",
  "setApprovalForAll",
  "setDefaultRoyalty",
  "setPregnancyLimits",
  "setReward",
  "setRules",
  "setSubscriptionId",
  "startRound",
  "topUp",
  "transfer",
  "transferAndCall",
  "transferERC20",
  "transferOwnership",
  "unBlacklist",
  "unWhitelist",
  "unWhitelistChild",
  "unpack",
  "unpause",
  "updateRule",
  "upgrade",
  "userOf",
  "whiteListChild",
  "whitelist",
  "withdrawBalance",
  "withdrawToken",
];

task("abis", "Save all functions abi separately")
  .addOptionalVariadicPositionalParam("files", "The files to include", undefined, types.inputFile)
  .setAction(async ({ files = "artifacts/contracts/" }, hre) => {
    const artfcts = await hre.artifacts.getArtifactPaths();
    const conart = artfcts.filter(
      art => art.includes(`${process.cwd()}/${files}`) || art.includes("@gemunion/contracts-chain-link-v2"),
    );

    const globFuncArr: Array<string> = [];
    const fwFuncArr: Array<string> = [];

    if (!fs.existsSync("./abis")) {
      fs.mkdirSync("./abis");
    }

    // FW
    // packages/abis/src/abis/balanceOf.json
    // if (!fs.existsSync("../../packages/abis/src/abis")) {
    //   fs.mkdirSync("../../packages/abis/src/abis");
    // }

    for (const art of conart) {
      const name = path.parse(art).name;

      const abif: IArtifact = JSON.parse(fs.readFileSync(art, "utf8"));

      const abifunct = abif.abi.filter(item => item.type === "function");

      for (const func of abifunct) {
        const isUnique = globFuncArr.indexOf(JSON.stringify(func)) === -1;

        if (isUnique) {
          globFuncArr.push(JSON.stringify(func));

          const funcabifile = `${name}.${func.name}`;

          if (fs.existsSync(`./abis/${funcabifile}.json`)) {
            const abifile: Array<IAbiObj> = JSON.parse(fs.readFileSync(`./abis/${funcabifile}.json`, "utf8"));
            const notIncludes = abifile.map(f => JSON.stringify(f)).indexOf(JSON.stringify(func)) === -1;

            if (notIncludes) {
              abifile.push(func);
              fs.writeFileSync(`./abis/${funcabifile}.json`, JSON.stringify(abifile), {
                encoding: "utf-8",
                flag: "w+",
              });
            }
          } else {
            fs.writeFileSync(`./abis/${funcabifile}.json`, JSON.stringify([func]), { encoding: "utf-8", flag: "w+" });
          }
          // FRAMEWORK ABIS
          if (fwFunctionNames.includes(func.name)) {
            const unique = fwFuncArr.indexOf(JSON.stringify(func)) === -1;
            if (unique) {
              fwFuncArr.push(JSON.stringify(func));

              // const filepath = `./abis/!fw/${func.name}.json`;
              const filepath = `../../packages/abis/src/abis/${func.name}.json`;

              if (fs.existsSync(filepath)) {
                const oldfile: Array<IAbiObj> = JSON.parse(fs.readFileSync(filepath, "utf8"));
                const notIncludes = oldfile.map(f => JSON.stringify(f)).indexOf(JSON.stringify(func)) === -1;

                if (notIncludes) {
                  oldfile.push(func);
                  fs.writeFileSync(filepath, JSON.stringify(oldfile), {
                    encoding: "utf-8",
                    flag: "w+",
                  });
                }
              } else {
                fs.writeFileSync(filepath, JSON.stringify([func]), {
                  encoding: "utf-8",
                  flag: "w+",
                });
              }
            }
          }
        }
      }
    }
  });

// hardhat abi contracts/ERC20/
