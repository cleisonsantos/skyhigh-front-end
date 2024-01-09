import { v4 as uuid } from "uuid";
import { api } from "./api";

type SignInRequestData = {
  email: string;
  password: string;
};

type User = {
  name: string;
  email: string;
  avatar_url: string;
};

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

const parseJwt = async (token: String) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(
      Buffer.from(base64Payload, "base64").toString("ascii")
    );
    return payload;
  } catch (error) {
    return null;
  }
};

export async function signInRequest(data: SignInRequestData) {
  const res = await api.post("/auth/login", data);
  const token = res.data.access_token;
  const user = await recoverUserInformation(token);
  return {
    token,
    user,
  };
}

export async function recoverUserInformation(token: String) {
  const obj = await parseJwt(token);
  const res = await api.get(`/users/${obj.id}`);
  const { name, email } = res.data;
  const user: User = {
    name,
    email,
    avatar_url: "https://github.com/cleisonsantos.png",
  };
  return user;
}
