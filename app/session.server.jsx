import { createCookieSessionStorage, redirect } from "react-router"

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__aapbAccess",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET], 
    secure: process.env.NODE_ENV !== "development",
  },
})

export async function requireAgreement(request) {
  const session = await sessionStorage.getSession( request.headers.get("Cookie") )
  const aapbAccessValue = session.get("aapbAccess")
  if (aapbAccessValue) {
    return true
  } else {
    return false
  }
}
