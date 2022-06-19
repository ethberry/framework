import { FC } from "react";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { IErc1155Token } from "@framework/types";

import { useStyles } from "./styles";
import { Erc1155Token } from "../../../erc1155/token-list/item";
import { MultiCarouselButtonGroup } from "./button-group";

declare interface IMultiCarouselProps {
  token: Array<IErc1155Token>;
}

export enum IResolutions {
  DESKTOP = "DESKTOP",
  TABLET = "TABLET",
  MOBILE = "MOBILE",
}

export const MultiCarousel: FC<IMultiCarouselProps> = props => {
  const { token } = props;

  const classes = useStyles();
  const there = useTheme();

  const responsive = {
    [IResolutions.DESKTOP]: {
      breakpoint: {
        max: document.documentElement.clientWidth, // there.breakpoints.values.lg
        min: there.breakpoints.values.md,
      },
      items: 3,
    },
    [IResolutions.TABLET]: {
      breakpoint: {
        max: there.breakpoints.values.md,
        min: there.breakpoints.values.sm,
      },
      items: 2,
    },
    [IResolutions.MOBILE]: {
      breakpoint: {
        max: there.breakpoints.values.sm,
        min: there.breakpoints.values.xs,
      },
      items: 1,
    },
  };

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("md"));

  const deviceType = isSmallScreen ? IResolutions.MOBILE : isMediumScreen ? IResolutions.TABLET : IResolutions.DESKTOP;

  return (
    <Carousel
      deviceType={deviceType}
      className={classes.container}
      itemClass={classes.item}
      responsive={responsive}
      arrows={false}
      renderButtonGroupOutside={true}
      customButtonGroup={<MultiCarouselButtonGroup />}
      infinite
    >
      {token.map(token => (
        <Erc1155Token key={token.id} token={token} />
      ))}
    </Carousel>
  );
};
