import url from 'url';

export type UrlMeta = {
  endpoint: string;
  params: Record<string, string>;
};

export const getUrlMeta = (routes: string[], reqUrl: string): UrlMeta => {
  const PARAM_PATTERN = /:[a-zA-Z]{0,10}/g;

  const config = {
    endpoint: reqUrl,
    params: {},
  };

  const baseUrl = url.parse(reqUrl, true).pathname;

  const splittedBaseUrl = baseUrl?.split('/') ?? [];
  const appropriateRoutes = routes.filter(
    (route) => route.split('/').length === splittedBaseUrl?.length
  );

  appropriateRoutes.forEach((route) => {
    const routeWithoutParam = route.replace(PARAM_PATTERN, '');
    const params = route.match(PARAM_PATTERN) ?? [];

    if (baseUrl?.startsWith(routeWithoutParam) && params.length) {
      config.endpoint = route;

      route.split('/').forEach((entity, idx) => {
        if (Array.from(params).includes(entity)) {
          config.params = {
            ...config.params,
            [entity.replace(':', '')]: splittedBaseUrl[idx],
          };
        }
      });
    }
  });

  return config;
};
