import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles<Theme>(
  theme => ({
    container: {
      padding: theme.spacing(3),
      borderRadius: theme.spacing(3),
      margin: theme.spacing(10, "auto"),
      width: 400,
    },
    paper: {
      padding: theme.spacing(2),
      width: "100%",
    },
    swap_container: {
      position: "absolute",
      top: 5,
      bottom: 5,
      left: 5,
      right: 5,
      padding: 20,
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "column",
      transition: "all 500ms ease",
      /* position: relative, */
      overflow: "hidden",
      borderRadius: 20,
      background: "white",
    },
    swap_header: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
    },
    swap_header_item: {
      fontWeight: "bolder",
      opacity: 0.3,
    },
    swap_header_item_active: {
      opacity: 1,
    },
    swap_form_container: {
      position: "relative",
      width: "100%",
      marginTop: "20px",
    },
    swap_form_token_dex_info_container: {
      display: "flex",
      alignItems: "space-between",
      width: "100%",
      marginTop: "20px",
      fontSize: "0.7rem",
    },
    swap_form_token_dex_info_title: {
      fontWeight: "bold",
      width: "50%",
    },
    swap_form_token_dex_info_toggle: {
      cursor: "pointer",
      width: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    swap_form_token_dex_info_toggle_action_text: {
      color: "rgba(0, 0, 0, 0.3)",
    },
    swap_form_meta_container: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.6rem",
      color: "rgba(0, 0, 0, 0.5)",
      marginTop: "20px",
    },
    button_group: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      gap: "5px",
      marginTop: "15px",
    },
    button: {
      cursor: "pointer",
      padding: "15px",
      margin: "5px 0px",
      width: "calc(100% - 30px)",
      borderRadius: "10px",
      background: "black",
      border: "1px solid black",
      color: "white",
    },
    button_light: {
      background: "transparent",
      color: "black",
    },
    button_light_white: {
      cursor: "pointer",
      padding: "15px",
      margin: "5px 0px",
      width: "calc(100% - 30px)",
      borderRadius: "10px",
      border: "1px solid black",
      composes: "button_light",
      background: "transparent",
      color: "white",
      borderColor: "white",
    },
    card: {
      margin: "30px",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
      padding: "20px",
      background: "white",
    },
  }),
  { name: "Swap" },
);
