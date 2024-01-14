import { Facebook } from "@mui/icons-material";
import { AuthType } from "@particle-network/auth";

import { GoogleIcon } from "../social-icons";

export const getParticleButtonIcon = (type: AuthType): any => {
  switch (type) {
    case "facebook":
      return <Facebook sx={{ color: "#4267B2" }} />;
    case "google":
      return <GoogleIcon />;
    default:
      return null;
  }
};
