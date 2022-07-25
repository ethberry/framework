import { FC, createElement } from "react";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { ITemplate } from "@framework/types";

import { useStyles } from "./styles";
import { MultiCarouselButtonGroup } from "./button-group";

declare interface IMultiCarouselProps {
  template: Array<ITemplate>;
  component: FC<{ template: ITemplate }>;
}

export enum IResolutions {
  DESKTOP = "DESKTOP",
  TABLET = "TABLET",
  MOBILE = "MOBILE",
}

export const MultiCarousel: FC<IMultiCarouselProps> = props => {
  const { template, component } = props;

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
      {template.map(template => createElement(component, { key: template.id, template }))}
    </Carousel>
  );
};
