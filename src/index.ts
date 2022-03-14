import { Client } from './client'

type APIClient = import('./types').APIClient
type APIClientFactory<T> = import('./types').APIClientFactory<T>
type Plugin = import('./client/types').Plugin

export * from './request'

const Plugins: Plugin[] = []

export const MyApp: APIClientFactory<APIClient> = Client.plugins(Plugins)

export const APIClient: APIClientFactory<APIClient> = Client.plugins(Plugins)
