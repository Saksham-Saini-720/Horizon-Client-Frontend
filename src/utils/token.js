export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getTokens=()=>{
  return {
    accessToken : localStorage.getItem("accessToken"),
    refreshToken : localStorage.getItem("refreshToken")
  }
}

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};