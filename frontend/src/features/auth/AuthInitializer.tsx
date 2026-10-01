import { useEffect } from "react";

import { useAppDispatch } from "../../app/hooks";
import { useGetMeQuery } from "../authApi";
import { setCredentials } from "../authSlice";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const { data, isSuccess } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (isSuccess && data && accessToken && refreshToken) {
      dispatch(
        setCredentials({
          user: data.user,
          accessToken,
          refreshToken,
        }),
      );
    }
  }, [isSuccess, data, accessToken, refreshToken, dispatch]);

  return null;
};

export default AuthInitializer;
