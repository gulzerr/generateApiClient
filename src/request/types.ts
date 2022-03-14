import {
  Endpoint,
  EndpointOptions,
  EndpointParams,
  Headers
} from '../endpoint/types'

export {
  Endpoint,
  EndpointDefaults,
  EndpointOptions,
  EndpointParams,
  Headers
} from '../endpoint/types'

export interface Response<T> {
  data: T
  headers: Headers
  params: Record<string, number | string>
  meta: {
    [key: string]: any
    url: string
    status: number
  }
}

export interface Request {
  (endpointRoute: string, endpointOptions?: EndpointParams): Promise<
    Response<any>
  >
  (endpointOptions: EndpointOptions): Promise<Response<any>>
  defaults(endpointOptions: EndpointParams): Request
  endpoint: Endpoint
}
