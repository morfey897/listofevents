import { transliterate } from "inflected";

export const EMAIL_REG_EXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PHONE_REG_EXP = /^\+?\d{10,}$/;

const SHORT_ID = /-{2}[A-Za-z0-9_-]{7,14}$/;

export function normalizeURL(val) {
  let url = transliterate(val || "").replace(/^[^A-Za-z]+/g, "").replace(/[\s-]+/g, "-").replace(/[^A-Za-z0-9-]+/g, "");
  let match = url.match(SHORT_ID);
  return match && match[0] ? url.replace(match[0], "").toLowerCase() + match[0] : url.toLowerCase();
}