import React, {FC, Fragment} from "react";

import {NewProducts} from "./new-products";
import {PromoCarousel} from "./promo-carousel";

export const Landing: FC = () => {
  return (
    <Fragment>
      <PromoCarousel />
      <NewProducts />
    </Fragment>
  );
};
