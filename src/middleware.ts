import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "de"],

  // Used when no locale matches
  defaultLocale: "en",
});

// This example protects all routes including api/trpc routes so it will cause a redirect to Clerk's Account portal
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  beforeAuth: (req) => {
    console.log("before auth");
    // Execute next-intl middleware before Clerk's auth middleware
    //return intlMiddleware(req); // this will navigate to localhost:3000/en which is not a defined route
  },
  publicRoutes: ["/"],
  debug: false,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
