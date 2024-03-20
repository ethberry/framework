import { ChangeEvent, FC, PropsWithChildren, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from "@mui/material";

import { useApiCall } from "@gemunion/react-hooks";

export const TwoFAProvider: FC<PropsWithChildren> = props => {
  const { children } = props;

  const is2FAValid = localStorage.getItem("is2FAValid");
  const [otp, setOtp] = useState<string>("");
  const [is2FAActive, setIs2FAActive] = useState<boolean | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value);
  };

  const { fn: get2FAStatus, isLoading } = useApiCall(
    async api => {
      return api
        .fetchJson({
          url: "/2fa",
        })
        .then((json: boolean) => {
          setIs2FAActive(json || false);
        });
    },
    { success: false, error: false },
  );

  const { fn: verify, isLoading: isVerifying } = useApiCall(
    async (api, data: { token: string }) => {
      return api
        .fetchJson({
          url: "/2fa/verify",
          method: "POST",
          data,
        })
        .then((json: boolean) => {
          if (json) {
            localStorage.setItem("is2FAValid", "true");
          } else {
            localStorage.removeItem("is2FAValid");
          }
        });
    },
    { success: false, error: false },
  );

  const handleClick = async () => {
    await verify(void 0, { token: otp });
  };

  useEffect(() => {
    void get2FAStatus();
  }, []);

  return (
    <>
      {is2FAActive && !is2FAValid && (
        <Dialog maxWidth="lg" open>
          <FormControl disabled={isVerifying || isLoading}>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogContent>
              <TextField value={otp} name="otpToken" label="Enter OTP" placeholder="OTP" onChange={handleChange} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClick}>Check</Button>
            </DialogActions>
          </FormControl>
        </Dialog>
      )}
      {children}
    </>
  );
};
