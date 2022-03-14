/* eslint-disable no-console */

type APIClient = import('./types').APIClient
type Options = import('./types').Options

function noticePlugin(_client: APIClient, clientOptions: Options): void {
  const { notice = true } = clientOptions

  if (!notice) return

  console.log('Generating API Client initialized!')
}

export default noticePlugin
