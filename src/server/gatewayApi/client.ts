import {
  Configuration,
  Converter3DApi,
  EventsApi,
  StatsApi,
} from "./generated";

export async function getApis() {
  const config = new Configuration({
    basePath: `/api/gateway`,
  });

  const eventsApi = new EventsApi(config);
  const statsApi = new StatsApi(config);
  const converter3DApi = new Converter3DApi(config);

  return { eventsApi, statsApi, converter3DApi };
}
