import { Ably } from "@refinedev/ably";

const apiKey = import.meta.env.VITE_ABLY_API_KEY;
if (!apiKey) {
  throw new Error("VITE_ABLY_API_KEY is not defined");
}

export const ablyClient = new Ably.Realtime(apiKey);
