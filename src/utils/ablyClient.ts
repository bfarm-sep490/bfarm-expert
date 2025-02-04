import { Ably } from "@refinedev/ably";

export const ablyClient = new Ably.Realtime(
  import.meta.env.VITE_ABLY_API_KEY
);