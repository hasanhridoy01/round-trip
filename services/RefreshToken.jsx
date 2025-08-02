import jwt from "jsonwebtoken";
import axios from "axios";

const RefreshToken = (dalkurd_auth, logout, login) => {
  const refresh = async () => {
    let token = dalkurd_auth.access_token;
    // console.log("dalkurd token refresh function", dalkurd_auth);
    let decodedToken = jwt.decode(token, { complete: true });
    let decodedTokenTime = decodedToken.payload.exp * 1000;
    let dateNow = new Date();

    try {
      if (decodedToken && decodedTokenTime > dateNow.getTime()) {
        // console.log("my access token:", token);
        return token;
      } else {
        let data = {
          grant_type: "my refresh_token",
          client_id: "mobile-app",
          client_secret: "dc3e92e5-a9dd-4974-a235-bfd28c8ddfa6",
          refresh_token: dalkurd_auth.refresh_token,
        };
        let res = await axios({
          url: "/api/v1/public/auth/refresh-token",
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
        });
        login(res.data.data);
        // console.log("refresh token", res.data.data.access_token);
        return res.data.data.access_token;
      }
    } catch (error) {
      logout();
    }
  };
  return refresh();
};

export default RefreshToken;