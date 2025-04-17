import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "./env";

const publicRoutes = ["/authenticate"];

export default async function middleware(request: NextRequest) {
	const pathName = request.nextUrl.pathname;

	const isPublicRoute = publicRoutes.includes(pathName);
	const headerCookies = request.headers.get("cookie") ?? "";

	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: env.NEXT_PUBLIC_APP_URL,
			headers: {
				cookie: headerCookies,
			},
		},
	);

	if (session && isPublicRoute && pathName !== "/") {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (!session && !isPublicRoute && pathName !== "/authenticate") {
		return NextResponse.redirect(new URL("/authenticate", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$).*)"],
};
