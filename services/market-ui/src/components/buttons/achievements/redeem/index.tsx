import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { IAchievementItemReport, IAchievementRule, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";

import TemplatePurchaseABI from "../../../../abis/components/buttons/hierarchy/template/purchase/purchase.abi.json";

interface IAchievementRedeemButtonProps {
  achievementRule: IAchievementRule;
  count: IAchievementItemReport;
}

export const AchievementRedeemButton: FC<IAchievementRedeemButtonProps> = props => {
  const { achievementRule, count = { count: 0 } } = props;

  const settings = useSettings();

  const achievementLevel = achievementRule.levels.reduce((foundLevel, nextLevel) => {
    if (nextLevel.amount > count.count && nextLevel.id > foundLevel.id) {
      return nextLevel;
    }
    return foundLevel;
  }, achievementRule.levels[0]);

  const previousLevels = achievementRule.levels.filter(({ amount }) => amount < achievementLevel.amount);

  const previousLevelsNotRedeemed = previousLevels.some(({ redemptions }) => !redemptions?.length);

  const disabled =
    !previousLevelsNotRedeemed && (!!achievementLevel.redemptions?.length || count.count !== achievementLevel.amount);

  const metaFnWithSign = useServerSignature((_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, TemplatePurchaseABI, web3Context.provider?.getSigner());
    return contract.achievement(
      {
        nonce: utils.arrayify(sign.nonce),
        externalId: achievementRule.id,
        expiresAt: sign.expiresAt,
        referrer: settings.getReferrer(),
      },
      achievementLevel.item?.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        // pass templateId instead of tokenId = 0
        tokenId:
          component.template!.tokens![0].tokenId === "0"
            ? component.template!.tokens![0].templateId
            : component.template!.tokens![0].tokenId,
        amount: component.amount,
      })),
      [],
      sign.signature,
    ) as Promise<void>;
  });

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/achievements/sign",
        method: "POST",
        data: {
          account,
          referrer: settings.getReferrer(),
          achievementLevelId: achievementRule.id,
        },
      },
      null,
      web3Context,
    );
  });

  const handleRedeem = async () => {
    await metaFn();
  };

  return (
    <Button variant="contained" onClick={handleRedeem} data-testid="AchievementRedeemButton" disabled={disabled}>
      <FormattedMessage id="form.buttons.redeem" />
    </Button>
  );
};
