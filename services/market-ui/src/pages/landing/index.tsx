import { FC, Fragment } from "react";

import { NewErc721 } from "./new-erc721";
import { NewErc998 } from "./new-erc998";
import { NewErc1155 } from "./new-erc1155";
import { NewMysterybox } from "./new-mysterybox";
import { NewAssetPromo } from "./new-asset-promo";
// import { PromoCarousel } from "./promo-carousel";

export const Landing: FC = () => {
  return (
    <Fragment>
      {/* <PromoCarousel /> */}
      <NewAssetPromo />
      <NewErc721 />
      <NewErc998 />
      <NewErc1155 />
      <NewMysterybox />
    </Fragment>
  );
};
