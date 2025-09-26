import axios from "axios";
import {
  createContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { useCookies } from "react-cookie";
import { useJwt } from "react-jwt";

type ProfileLocalStorageType = {
  userName?: string;
  email?: string;
};
import { WeatherResponseTypes } from "../@types/weatherResponseTypes";

// Types for context props and decoded token data
interface ProfileContextProps {
  children: ReactNode;
}

type DecodedTokenType = {
  sub: string;
  iat: number;
  exp: number;
  userName: string;
};

interface LocationType {
  latitude: number;
  longitude: number;
}

interface ProfileDataType {
  sub: string;
  iat: number;
  exp: number;
  isExpired: boolean;
  token?: string;
  location?: LocationType | null;
  geoError?: string | null;
  weatherData: WeatherResponseTypes | null;
  userName: string;
  getProfileData: () => ProfileLocalStorageType | null;
}

interface CookieSetOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

interface ProfileContextType {
  profileData: ProfileDataType;
  reEvaluateToken: (token: string) => void;
  setCookie: (name: "token", value: string, options?: CookieSetOptions) => void;
  removeCookie: (name: "token", options?: CookieSetOptions) => void;
  removeProfileData: () => void;
  updateProfileData: (value: ProfileLocalStorageType) => void;
  saveProfileData: (value: ProfileLocalStorageType) => void;
}

export const ProfileContext = createContext<ProfileContextType>(
  {} as ProfileContextType,
);

export function ProfileContextProvider({ children }: ProfileContextProps) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const [location, setLocation] = useState<LocationType | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponseTypes | null>(
    null,
  );
  const { decodedToken, isExpired, reEvaluateToken } = useJwt<DecodedTokenType>(
    cookies.token,
  );

  const saveProfileData = useCallback((value: ProfileLocalStorageType) => {
    return localStorage.setItem("ProfileData", JSON.stringify(value));
  }, []);

  const removeProfileData = useCallback(() => {
    return localStorage.removeItem("ProfileData");
  }, []);

  const updateProfileData = useCallback((value: ProfileLocalStorageType) => {
    localStorage.setItem("ProfileData", JSON.stringify(value));
  }, []);

  const getProfileData = useCallback((): ProfileLocalStorageType | null => {
    const data = localStorage.getItem("ProfileData");
    return data ? JSON.parse(data) : null;
  }, []);

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setGeoError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setGeoError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setGeoError("The request to get user location timed out.");
              break;
            default:
              setGeoError("An unknown error occurred.");
              break;
          }
        },
      );
    } else {
      setGeoError("Geolocation is not supported by this browser.");
    }
  }, []);

  const getCodeCity = useCallback(async () => {
    if (!location) return;
    try {
      const responseCode = await axios.get<WeatherResponseTypes>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude.toFixed(2)}&lon=${location.longitude.toFixed(2)}&appid=${import.meta.env.VITE_API_OPENWATHER_KEY}`,
        { headers: { "Content-Type": "application/json" } },
      );
      const dataCode = responseCode.data;
      setWeatherData(dataCode);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred");
      }
    }
  }, [location]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);
  useEffect(() => {
    getCodeCity();
  }, [getCodeCity]);

  const profileData: ProfileDataType = useMemo(
    () => ({
      sub: decodedToken?.sub ?? "",
      iat: decodedToken?.iat ?? 0,
      exp: decodedToken?.exp ?? 0,
      userName: decodedToken?.userName ?? "",
      isExpired: !!isExpired,
      token: cookies.token,
      location,
      geoError,
      weatherData,
      getProfileData,
    }),
    [
      decodedToken,
      isExpired,
      cookies.token,
      location,
      geoError,
      weatherData,
      getProfileData,
    ],
  );

  const valueContext = useMemo(
    () => ({
      profileData,
      reEvaluateToken,
      setCookie,
      removeCookie,
      updateProfileData,
      removeProfileData,
      saveProfileData,
    }),
    [
      profileData,
      reEvaluateToken,
      setCookie,
      removeCookie,
      updateProfileData,
      removeProfileData,
      saveProfileData,
    ],
  );

  return (
    <ProfileContext.Provider value={valueContext}>
      {children}
    </ProfileContext.Provider>
  );
}
