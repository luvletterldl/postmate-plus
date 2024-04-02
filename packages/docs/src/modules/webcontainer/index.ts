import { WebContainer } from '@webcontainer/api'

// eslint-disable-next-line import/no-mutable-exports
export let wci: WebContainer
/** 初始化 WebContainer instance */
export async function initWebContainer() {
  if (!wci)
    wci = await WebContainer.boot()
}

export async function writeIndexJS(content: string) {
  await wci.fs.writeFile('/index.js', content)
}

export async function startDevServer(iframeEl: HTMLIFrameElement) {
  // Run `npm run start` to start the Express app
  await wci.spawn('npm', ['run', 'start'])

  // Wait for `server-ready` event
  wci.on('server-ready', (port, url) => {
    consola.log('server-ready', url, port)
    iframeEl.src = url
  })
}

export async function installDependencies() {
  // Install dependencies
  const installProcess = await wci.spawn('npm', ['install'])
  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      consola.log(data)
    },
  }))
  // Wait for install command to exit
  return installProcess.exit
}
