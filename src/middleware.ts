import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { createServerClient } from "@supabase/ssr";
import { getLocale } from "next-intl/server";

const noneAuthenticatedPathnames: Array<string> = [
  "",
  "/",
  "/login",
  "/register",
];

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  console.debug(`Middleware: is acting to : [${request.nextUrl.pathname}]`);

  //* Manage international routes.
  let intlResponse = intlMiddleware(request);

  //* Update the session.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          intlResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            intlResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  
  //* Get the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  function isPathname(targets: Array<string>): boolean {
    const pathname = request.nextUrl.pathname;
    if (targets.includes(pathname)) return true;

    const locales = routing.locales;
    let targetsWithLocale: Array<string> = [];
    locales.forEach((locale) => {
      const newLocalePathnames = targets.map((target) => {
        return `/${locale}${target}`;
      });
      targetsWithLocale = [...targetsWithLocale, ...newLocalePathnames];
    });
    if (targetsWithLocale.includes(pathname)) return true;

    return false;
  }

  //* Check if the user exists (if not redirect to login page).
  if (!user && !isPathname(noneAuthenticatedPathnames)) {
    console.log("User is not logged in redirecting to login page.");
    const url = request.nextUrl.clone();
    url.pathname = `/${await getLocale()}/login`;
    return NextResponse.redirect(url);
  }

  //* Return usual response.
  return intlResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
