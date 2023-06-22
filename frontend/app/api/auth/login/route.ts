import { api } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import { getForwardHeaders, setCookies } from "../auth-utils";
import { tokensResponseSchema } from "@/schema/auth-schema";
import { env } from "@/env/server.mjs";
import { AxiosError } from "axios";
import { signinSchema } from "@transcendence/common";

export async function POST(req: NextRequest) {
  try {
    const sigInData = signinSchema.parse(await req.json());
    const { data } = await api.post(`/authentication/sign-in`, sigInData, {
      headers: getForwardHeaders(req),
    });
    const tokens = tokensResponseSchema.parse(data);
    const response = NextResponse.redirect(env.APP_URL);
    return setCookies(response, tokens);
  } catch (error) {
    if (error instanceof AxiosError) {
      let message = null;
      if (error.response?.status == 401) {
        message = "Invalid credentials";
      }
      return new Response(message ?? "Unkown error", {
        status: error.response?.status,
      });
    }
    return new Response("server error", { status: 500 });
  }
}
