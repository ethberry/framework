import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { IAchievementLevel, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";

import TemplatePurchaseABI from "../../../../abis/components/buttons/hierarchy/template/purchase/purchase.abi.json";

interface IAchievementRedeemButtonProps {
  achievementLevel: IAchievementLevel;
}

export const AchievementRedeemButton: FC<IAchievementRedeemButtonProps> = props => {
  const { achievementLevel } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature((_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, TemplatePurchaseABI, web3Context.provider?.getSigner());
    return contract.achievement(
      {
        nonce: utils.arrayify(sign.nonce),
        externalId: achievementLevel.id,
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
          achievementLevelId: achievementLevel.id,
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
    <Button onClick={handleRedeem} data-testid="AchievementRedeemButton">
      <FormattedMessage id="form.buttons.redeem" />
    </Button>
  );
};
