import { FC } from "react";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { IAssetPromo } from "@framework/types";

import { AssetPromoBanner } from "./banner";
import { Root } from "./styled";

declare interface IMultiCarouselAssetPromoProps {
  promo: Array<IAssetPromo>;
}

export enum IResolutions {
  DESKTOP = "DESKTOP",
  TABLET = "TABLET",
  MOBILE = "MOBILE",
}

export const MultiCarouselAssetPromo: FC<IMultiCarouselAssetPromoProps> = ({ promo }) => {
  const there = useTheme();

  const responsive = {
    [IResolutions.DESKTOP]: {
      breakpoint: {
        max: 3000,
        min: there.breakpoints.values.md,
      },
      items: 1,
    },
    [IResolutions.TABLET]: {
      breakpoint: {
        max: there.breakpoints.values.md,
        min: there.breakpoints.values.sm,
      },
      items: 1,
    },
    [IResolutions.MOBILE]: {
      breakpoint: {
        max: there.breakpoints.values.sm,
        min: 0,
      },
      items: 1,
    },
  };

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("md"));

  const deviceType = isSmallScreen ? IResolutions.MOBILE : isMediumScreen ? IResolutions.TABLET : IResolutions.DESKTOP;

  return (
    <Root>
      <Carousel
        ssr
        autoPlay
        autoPlaySpeed={5000}
        arrows={false}
        draggable={false}
        showDots
        renderDotsOutside
        dotListClass={"MultiCarouselPromo-DotList"}
        className={"MultiCarouselPromo-Container"}
        itemClass={"MultiCarouselPromo-Item"}
        deviceType={deviceType}
        responsive={responsive}
        infinite
      >
        {promo.map(promo => (
          <AssetPromoBanner key={promo.id} promo={promo} />
        ))}
      </Carousel>
    </Root>
  );
};
