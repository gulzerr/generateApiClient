import { constructor } from './constructor'
import { registerPlugins } from './register-plugins'

type APIClientFactory = import('./types').APIClientFactory
type Plugin = import('./types').Plugin

export function factory(plugins: Plugin[] = []): APIClientFactory {
  const MyApp = constructor.bind(null, plugins) as APIClientFactory
  MyApp.plugins = registerPlugins.bind(null, plugins)
  return MyApp
}
