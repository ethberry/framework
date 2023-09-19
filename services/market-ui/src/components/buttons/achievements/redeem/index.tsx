import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { useMetamask, useServerSignature, useSystemContract } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IAchievementItemReport, IAchievementRule, IContract } from "@framework/types";
import { SystemModuleType, TokenType } from "@framework/types";

import ClaimABI from "../../../../abis/mechanics/claim/redeem/claim.abi.json";

interface IAchievementRedeemButtonProps {
  achievementRule: IAchievementRule;
  className?: string;
  count: IAchievementItemReport;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const AchievementRedeemButton: FC<IAchievementRedeemButtonProps> = props => {
  const { achievementRule, className, count = { count: 0 }, disabled, variant = ListActionVariant.button } = props;
  const settings = useSettings();

  const levelsNotRedeemed = achievementRule.levels.filter(lvl => lvl.redemptions?.length === 0);

  const achievementLevel = levelsNotRedeemed.reduce((foundLevel, nextLevel) => {
    if (nextLevel.amount > count.count && nextLevel.id > foundLevel.id) {
      return nextLevel;
    }
    return foundLevel;
  }, levelsNotRedeemed[0]);

  const previousLevels = achievementLevel
    ? achievementRule.levels.filter(({ amount }) => amount < achievementLevel.amount)
    : [];
  const previousLevelsNotRedeemed = previousLevels.length
    ? previousLevels.some(({ redemptions }) => !redemptions?.length)
    : true;

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, ClaimABI, web3Context.provider?.getSigner());

      return contract.claim(
        {
          externalId: sign.bytecode, // claimEntity ID
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.hexZeroPad(utils.hexlify(achievementLevel.id), 32),
          receiver: achievementRule.contract!.merchant!.wallet,
          referrer: settings.getReferrer(),
        },
        achievementLevel.item?.components.map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          // pass templateId instead of tokenId = 0
          tokenId:
            component.contract!.contractType === TokenType.ERC1155
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          amount: component.amount,
        })),
        sign.signature,
      ) as Promise<void>;
    },
  );

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (_values: null, web3Context: Web3ContextType, systemContract: IContract) => {
      const { account } = web3Context;

      return metaFnWithSign(
        {
          url: "/achievements/sign",
          method: "POST",
          data: {
            account,
            referrer: settings.getReferrer(),
            achievementLevelId: achievementLevel.id,
          },
        },
        null,
        web3Context,
        systemContract,
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.EXCHANGE, null, web3Context);
  });

  const handleRedeem = async () => {
    await metaFn().finally(() => {
      // TODO reload page
      // window.location.reload();
    });
  };

  return (
    <ListAction
      onClick={handleRedeem}
      icon={Redeem}
      message="form.buttons.redeemLvl"
      messageValues={
        !disabled
          ? { level: achievementLevel ? `LVL: ${achievementLevel.achievementLevel.toString()}` : "" }
          : { level: "" }
      }
      className={className}
      dataTestId="AchievementRedeemButton"
      disabled={
        disabled ||
        !achievementLevel ||
        (!previousLevelsNotRedeemed &&
          (!!achievementLevel.redemptions?.length || count.count < achievementLevel.amount))
      }
      variant={variant}
    />
  );
};
