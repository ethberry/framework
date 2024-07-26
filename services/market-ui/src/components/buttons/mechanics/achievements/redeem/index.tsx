import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils, constants } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useAppSelector } from "@gemunion/redux";
import { walletSelectors } from "@gemunion/provider-wallet";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IAchievementItemReport, IAchievementRule, IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import ClaimABI from "@framework/abis/json/ExchangeClaimFacet/claim.json";
import { sorter } from "../../../../../utils/sorter";

interface IAchievementRedeemButtonProps {
  achievementRule: IAchievementRule;
  className?: string;
  count: IAchievementItemReport;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const AchievementRedeemButton: FC<IAchievementRedeemButtonProps> = props => {
  const { achievementRule, className, count = { count: 0 }, disabled, variant = ListActionVariant.button } = props;
  const referrer = useAppSelector(walletSelectors.referrerSelector);

  const levelsNotRedeemed = achievementRule.levels.filter(lvl => lvl.redemptions?.length === 0);

  // const redeemableLevels = achievementRule.levels.filter(lvl => lvl.amount <= count.count);

  // Level to achieve = lowest not redeemed level
  const achievementLevel = levelsNotRedeemed.sort(sorter("achievementLevel"))[0];
  // const achievementLevel = levelsNotRedeemed.reduce((foundLevel, nextLevel) => {
  //   if (nextLevel.amount > count.count && nextLevel.achievementLevel > foundLevel.achievementLevel) {
  //     return nextLevel;
  //   }
  //   return foundLevel;
  // }, levelsNotRedeemed[0]);

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
          // extra: utils.hexZeroPad(utils.hexlify(achievementLevel.id), 32),
          extra: utils.hexZeroPad(utils.hexlify(0), 32),
          receiver: achievementRule.contract!.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        achievementLevel.reward?.components.map(component => ({
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

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/achievements/sign",
        method: "POST",
        data: {
          referrer,
          achievementLevelId: achievementLevel.id,
        },
      },
      null,
      web3Context,
    ) as Promise<void>;
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
