import { Cookies } from 'quasar'

interface ICookieOptions {
  expires?: number | string | Date;
  path?: string;
  domain?: string;
  sameSite?: "Lax" | "Strict" | "None";
  httpOnly?: boolean;
  secure?: boolean;
  other?: string;
}

export function useCookies() {
  function setCookie(key: string, value: string, options?: ICookieOptions) {
    Cookies.set(key, value, options)
  }

  function getCookie(key: string) {
    return Cookies.get(key)
  }

  function removeCookie(key: string) {
    Cookies.remove(key)
  }

  return { setCookie, getCookie, removeCookie }
}
