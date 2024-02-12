import { redis } from "@/lib/redis";
import { getDate } from "@/utils";
import { parse } from "date-fns";

type AnalyticsArgs = {
  retention?: number;
};
type TrackOptions = {
  persist?: boolean;
};

export class Analytics {
  private retention: number = 60 * 60 * 24 * 7;

  constructor(opts?: AnalyticsArgs) {
    if (opts?.retention) this.retention = opts.retention;
  }
  async track(namespace: string, event: object = {}, opts?: TrackOptions) {
    let KEY = `analytics::${namespace}`;
    //    db call to persist this event
    if (!opts?.persist) {
      KEY += `::${getDate()}`;
    }
    await redis.hincrby(KEY, JSON.stringify(event), 1);
    if (!opts?.persist) await redis.expire(KEY, this.retention);
  }

  async retrieveDays(namespace: string, nDays: number) {
    type AnalyticsPromise = ReturnType<typeof analytics.retrive>;
    const promises: AnalyticsPromise[] = [];

    for (let i = 0; i < nDays; i++) {
      const formattedDate = getDate(i);
      const promise = analytics.retrive(namespace, formattedDate);
      promises.push(promise);
    }
    const fetched = await Promise.all(promises);
    const data = fetched.sort((a,b) => {
      if(parse(a.date,"dd/MM/yyyy", new Date())> parse(b.date,"dd/MM/yyyy", new Date())){
        return 1
      }else {
        return -1
      }
    });

    return data
  }
  async retrive(namespace: string, date: string) {
    const res = await redis.hgetall<Record<string, string>>(
      `analytics::${namespace}::${date}`
    );
    return {
      date,
      event: Object.entries(res ?? []).map(([key, value]) => ({
        [key]: Number(value),
      })),
    };
  }
}

export const analytics = new Analytics();
