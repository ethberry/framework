import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => {
    return {
      container: {
        height: "100%",
        minHeight: "450px",
        maxHeight: "450px",
        maxWidth: "1150px",
        padding: "0 20px",
        margin: "0 auto",
        [theme.breakpoints.down("sm")]: {
          maxHeight: "650px",
        },
      },
      item: {
        display: "flex",
        justifyContent: "center",
        height: "100%",
        maxHeight: "450px",
        paddingRight: 20,
        [theme.breakpoints.down("sm")]: {
          maxHeight: "650px",
        },
      },
      dotList: {
        position: "absolute",
        [theme.breakpoints.down("sm")]: {
          justifyContent: "space-around",
          width: "100%",
        },
        "& .react-multi-carousel-dot": {
          [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginRight: "8px",
            justifyContent: "center",
            "&:last-of-type": {
              marginRight: 0,
            },
          },
          "& button": {
            pointerEvents: "all",
            cursor: "pointer",
            width: "100px",
            height: "6px",
            borderRadius: "3px",
            marginRight: "10px",
            border: 0,
            backgroundColor: "#C1D6E9",
            overflow: "hidden",
            [theme.breakpoints.down("sm")]: {
              width: "100%",
              maxWidth: "100px",
            },
            "&:before": {
              content: `''`,
              display: "block",
              height: "100%",
              width: 0,
              backgroundColor: "#84AED3",
            },
          },
          "&.react-multi-carousel-dot--active": {
            "& button": {
              "&:before": {
                width: "100%",
                transition: "width 5s linear",
              },
            },
          },
        },
      },
    };
  },
  { name: "MultiCarouselPromo" },
);
