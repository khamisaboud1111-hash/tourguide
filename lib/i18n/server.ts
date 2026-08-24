import { cookies } from "next/headers";
import { dictionary, type Lang } from "./dictionary";

export function getLang(): Lang {
  const cookieStore = cookies();
  const c = cookieStore.get("lang")?.value as Lang | undefined;
  const allowed: Lang[] = ["en","sw","fr","de","it","es","zh","ja","ar","ru","pt","nl"];
  if (c && allowed.includes(c)) return c;
  return "en";
}

export function tServer(key: string, lang?: Lang): string {
  const l = lang ?? getLang();
  return dictionary[l]?.[key] ?? dictionary.en[key] ?? key;
}
