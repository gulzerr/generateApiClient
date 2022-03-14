type BareAPIClient = import('./client/types').APIClient
type BareOptions = import('./client/types').Options
type Plugin = import('./client/types').Plugin

export interface Options extends BareOptions {}

export interface APIClient extends BareAPIClient {}

export interface APIClientFactory<APIClient> {
  new (options?: Options): APIClient
  (options?: Options): APIClient

  plugins(plugins: Plugin[]): APIClientFactory<APIClient>
}
