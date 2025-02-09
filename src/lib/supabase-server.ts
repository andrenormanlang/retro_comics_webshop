import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const createServerClient = () => {
  const cookieStore = (cookies() as unknown as UnsafeUnwrappedCookies);
//@ts-ignore
  return createServerComponentClient({ cookies: () => cookieStore });
};
