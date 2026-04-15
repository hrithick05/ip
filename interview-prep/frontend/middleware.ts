import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublic = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    if (!isPublic(req)) {
      await auth.protect();
    }
  } catch {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
