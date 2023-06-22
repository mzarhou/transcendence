import { api } from "@/lib/api";
import { tokensResponseSchema } from "@/schema/auth-schema";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getForwardHeaders, setCookies } from "../auth-utils";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({});
  try {
    const { data } = await api.post(
      `/authentication/refresh-tokens`,
      {
        refreshToken: req.cookies.get("refreshToken")?.value ?? null,
      },
      {
        headers: getForwardHeaders(req),
      }
    );
    const tokens = tokensResponseSchema.parse(data);
    console.log("refreshing tokens...");
    return setCookies(response, tokens);
  } catch (error) {}
  return response;
}
