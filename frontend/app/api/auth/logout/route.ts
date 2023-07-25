import { NextRequest, NextResponse } from "next/server";
import { setCookies } from "../auth-utils";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({});
  return setCookies(
    response,
    {
      accessToken: "",
      refreshToken: "",
    },
    {
      maxAge: -1,
    }
  );
}
