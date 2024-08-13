import { ENV } from "@/env";
import PocketBase from "pocketbase";

const globalForPb = global as unknown as {
  pb?: PocketBase;
};

export const pb = globalForPb.pb ?? new PocketBase(ENV.database_url);

if (!globalForPb.pb) {
  pb.authStore.save(ENV.pb_token);
  globalForPb.pb = pb;
}
