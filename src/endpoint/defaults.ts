type EndpointDefaults = import('./types').EndpointDefaults

export const DEFAULTS: EndpointDefaults = {
  method: `GET`,
  baseUrl: `mock.link`,
  headers: {
    accept: `application/json`,
    'user-agent': `@gulzerr/api-client/${process.env.API_CLIENT_VERSION}`
  }
}
