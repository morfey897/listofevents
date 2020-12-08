import { transliterate } from "inflected";

export const EMAIL_REG_EXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PHONE_REG_EXP = /^\+?\d{10,}$/;
export const NAME_REG_EXP = /^\s*\S{3,}/;

export const EMAIL = "email";
export const PHONE = "phone";
export const NONE = "none";

export const ERROR_WRONG = 101;
export const ERROR_INCORRECT_CODE = 102;
export const ERROR_USER_EXIST = 103;
export const ERROR_USER_NOT_EXIST = 104;
export const ERROR_INCORRECT_USERNAME = 105;

export function normalizeURL(val) {
  return transliterate(val || "").replace(/^[^A-Za-z]+/g, "").replace(/[\s-]+/g, "-").replace(/[^A-Za-z0-9-]+/g, "").toLowerCase();
}