import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({});
  response.cookies.set("accessToken", "", { maxAge: -1 });
  response.cookies.set("refreshToken", "", { maxAge: -1 });
  return response;
}
