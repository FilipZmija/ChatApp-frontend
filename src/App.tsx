import React, { useEffect, useState } from "react";
import Login from "./Auth/Login";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import MainView from "./MainApp/MainView";
import axios, { AxiosResponse } from "axios";
import { IAuthData } from "./Auth/Auth.types";
import { login } from "./redux/slices/authSlice";
interface IAuthResponse {
  user: IAuthData;
}

export default function App() {
  const accessToken = useAppSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response: AxiosResponse<IAuthResponse> = await axios.get(
            `${process.env.REACT_APP_API_URL}/user/data`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const { name, id } = response.data.user;

          dispatch(login({ token, name, id }));
        } catch (e: any) {
          console.error(e);
          localStorage.removeItem("token");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })();
  }, [dispatch]);
  return <>{loading ? <></> : accessToken ? <MainView /> : <Login />}</>;
}
