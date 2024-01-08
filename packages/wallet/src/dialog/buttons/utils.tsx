import { Facebook, Google } from "@mui/icons-material";
import { AuthType } from "@particle-network/auth";

export const getParticleButtonIcon = (type: AuthType): any => {
  switch (type) {
    case "facebook":
      return <Facebook />;
    case "google":
      return <Google />;
    default:
      return null;
  }
};
