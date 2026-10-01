import { useEffect } from "react";

import { useAppDispatch } from "../../app/hooks";
import { useGetMeQuery } from "../authApi";
import { setCredentials, setAuthInitialized } from "../authSlice";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const refreshToken = localStorage.getItem("refreshToken");

  const { data, isSuccess, isError, isLoading } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isSuccess && data && accessToken && refreshToken) {
      dispatch(
        setCredentials({
          user: data.user,
          accessToken,
          refreshToken,
        }),
      );
    }

    if (isError || !accessToken) {
      dispatch(setAuthInitialized());
    }

    if (isSuccess) {
      dispatch(setAuthInitialized());
    }
  }, [
    isLoading,
    isSuccess,
    isError,
    data,
    accessToken,
    refreshToken,
    dispatch,
  ]);

  return null;
};

export default AuthInitializer;
