import { Response } from 'node-fetch'

type ResponseData = {
  [key: string]: any
}

type ResponseError = {
  [key: string]: any
  status: number
  message: string
  errors?: Array<Record<string, any>>
}

export type FormattedResponse = {
  meta?: Record<string, any>
  params?: Record<string, number | string>
} & ({ data: ResponseData } | { error: ResponseError })

export type GetResponseBody = (
  response: Response
) => Promise<FormattedResponse | string | ArrayBuffer>

const formatLegacyResponse = ({
  isError,
  ...content
}: any): FormattedResponse => {
  const meta = {}

  if (isError) {
    const error: ResponseError = {
      message: '',
      status: 499,
      errors: []
    }

    const {
      body,
      errorMessage,
      error: _error,
      info,
      message,
      msg,
      result,
      ...others
    } = content

    if (body) {
      const { message, error: __error, err, status, ...restBody } = body

      error.message = message || __error || err || status
      error.errors!.push(restBody)
    } else {
      error.message = errorMessage || _error || info || message || msg || result
      error.errors!.push(others)
    }

    return { error, meta }
  }

  const { body = {}, ...others } = content

  const data = { ...body, ...others }

  return { data, meta }
}

const formatStandardResponse = ({
  data,
  error,
  params,
  ...meta
}: any): FormattedResponse => {
  return { data, error, meta, params }
}

export const getResponseBody: GetResponseBody = async response => {
  const contentType = response.headers.get('content-type') || ''

  if (/application\/json/.test(contentType)) {
    const json = await response.json()

    if (typeof json.isError === 'boolean') {
      return formatLegacyResponse(json)
    }

    return formatStandardResponse(json)
  }

  if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
    return response.text()
  }

  return response.arrayBuffer()
}
