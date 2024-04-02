/**
 * The type of messages our frames our sending
 */
// const messageType = 'application/x-postmate-v1+json'
// const messageType = `${Date.now()}${Math.random()}`

/**
 * The maximum number of attempts to send a handshake request to the parent
 * @type {number}
 */
const maxHandshakeRequests = 60

/**
 * A unique message ID that is used to ensure responses are sent to the correct requests
 * @type {number}
 */
let _messageId = 0

/**
 * Increments and returns a message ID
 * @return {number} A unique ID for a message
 */
export const generateNewMessageId = () => ++_messageId

/**
 * Postmate logging function that enables/disables via config
 * @param  {object} ...args Rest Arguments
 */
export const log = (...args: any[]) => console.log(...args)

/**
 * Takes a URL and returns the origin
 * @param  {string} url The full URL being requested
 * @return {string}     The URLs origin
 */
export function resolveOrigin(url: string) {
  const a = document.createElement('a')
  a.href = url
  const protocol = a.protocol.length > 4 ? a.protocol : window.location.protocol
  const host = a.host.length ? ((a.port === '80' || a.port === '443') ? a.hostname : a.host) : window.location.host
  return a.origin || `${protocol}//${host}`
}

const messageTypes = {
  'handshake': 1,
  'handshake-reply': 1,
  'call': 1,
  'sub-post': 1,
  'post': 1,
  'emit': 1,
  'reply': 1,
  'request': 1,
}

/**
 * Ensures that a message is safe to interpret
 * @param  {object} message The postmate message being sent
 * @param  {string | boolean} allowedOrigin The whitelisted origin or false to skip origin check
 * @return {boolean}
 */
export function sanitize(message: any, allowedOrigin: string, messageType: string) {
  if (
    typeof allowedOrigin === 'string'
    && message.origin !== allowedOrigin
  ) return false
  if (!message.data)
    return false
  if (
    typeof message.data === 'object'
    && !('postmate' in message.data)
  ) return false
  if (message.data.type !== messageType)
    return false
  // @ts-expect-error ignore
  if (!messageTypes[message.data.postmate])
    return false
  return true
}

/**
 * Takes a model, and searches for a value by the property
 * @param  {object} model     The dictionary to search against
 * @param  {string} property  A path within a dictionary (i.e. 'window.location.href')
 * @param  {object} data      Additional information from the get request that is
 *                            passed to functions in the child model
 * @return {Promise}
 */
export function resolveValue(model: any, property: string, data?: unknown) {
  let unwrappedContext = model[property]
  if (typeof model[property] === 'function')
    unwrappedContext = data !== undefined ? model[property](data) : model[property]()

  return Promise.resolve(unwrappedContext)
}

/**
 * Composes an API to be used by the parent
 * @param {object} info Information on the consumer
 */
export class ParentAPI {
  model?: any
  [x: string]: any
  constructor(info: any) {
    this.parent = info.parent
    this.frame = info.frame
    this.child = info.child
    this.childOrigin = info.childOrigin
    this.messageType = info.messageType
    this.events = {}

    log('Parent: Registering API')
    log('Parent: Awaiting messages...')

    this.listener = (e: any) => {
      if (!sanitize(e, this.childOrigin, this.messageType))
        return false

      /**
       * the assignments below ensures that e, data, and value are all defined
       */
      const { postmate, value, uid } = e?.data
      const { name, data } = value ?? {}

      if (postmate === 'emit') {
        log(`Parent: Received event emission: ${value.name}`)

        if (name in this.events) {
          this.events[name].forEach((callback: any) => {
            callback.call(this, data)
          })
        }
      }

      if (postmate === 'sub-post') {
        return resolveValue(this.model, name, data)
          .then(value => this.child.postMessage({
            property: name,
            postmate: 'reply',
            type: this.messageType,
            uid,
            value,
          }, e.origin))
      }
    }

    this.parent.addEventListener('message', this.listener, false)
    log('Parent: Awaiting event emissions from Child')
  }

  get(property: any) {
    return new Promise((resolve) => {
      // Extract data from response and kill listeners
      const uid = generateNewMessageId()
      const transact = (e: any) => {
        if (e.data.uid === uid && e.data.postmate === 'reply') {
          this.parent.removeEventListener('message', transact, false)
          resolve(e.data.value)
        }
      }

      // Prepare for response from Child...
      this.parent.addEventListener('message', transact, false)

      // Then ask child for information
      this.child.postMessage({
        postmate: 'request',
        type: this.messageType,
        property,
        uid,
      }, this.childOrigin)
    })
  }

  post(property: any, data: any) {
    return new Promise((resolve) => {
      // Extract data from response and kill listeners
      const uid = generateNewMessageId()
      const transact = (e: any) => {
        if (e.data.uid === uid && e.data.postmate === 'reply') {
          this.parent.removeEventListener('message', transact, false)
          resolve(e.data.value)
        }
      }

      // Prepare for response from Child...
      this.parent.addEventListener('message', transact, false)

      // Then ask child for information
      this.child.postMessage({
        postmate: 'post',
        type: this.messageType,
        property,
        data,
        uid,
      }, this.childOrigin)
    })
  }

  call(property: any, data: any) {
    // Send information to the child
    this.child.postMessage({
      postmate: 'call',
      type: this.messageType,
      property,
      data,
    }, this.childOrigin)
  }

  on(eventName: string, callback: unknown) {
    if (!this.events[eventName])
      this.events[eventName] = []

    this.events[eventName].push(callback)
  }

  destroy() {
    log('Parent: Destroying Postmate instance')
    window.removeEventListener('message', this.listener, false)
    this.frame.parentNode.removeChild(this.frame)
  }
}

/**
 * Composes an API to be used by the child
 * @param {object} info Information on the consumer
 */
export class ChildAPI {
  [x: string]: any
  constructor(info: any) {
    this.model = info.model
    this.parent = info.parent
    this.parentOrigin = info.parentOrigin
    this.child = info.child
    this.messageType = info.messageType

    log('Child: Registering API')
    log('Child: Awaiting messages...')

    this.child.addEventListener('message', (e: any) => {
      if (!sanitize(e, this.parentOrigin, this.messageType))
        return

      log('Child: Received request', e.data)

      const { property, uid, data, postmate } = e?.data

      if (postmate === 'call') {
        if (property in this.model && typeof this.model[property] === 'function')
          this.model[property](data)

        return
      }

      if (postmate === 'post') {
        return resolveValue(this.model, property, data)
          .then(value => this.parent.postMessage({
            property,
            postmate: 'reply',
            type: this.messageType,
            uid,
            value,
          }, e.origin))
      }

      if (postmate !== 'sub-post') {
        // Reply to Parent
        return resolveValue(this.model, property)
          .then(value => e.source.postMessage({
            property,
            postmate: 'reply',
            type: this.messageType,
            uid,
            value,
          }, e.origin))
      }
    })
  }

  emit(name: string, data: any) {
    log(`Child: Emitting Event "${name}"`, data)

    this.parent.postMessage({
      postmate: 'emit',
      type: this.messageType,
      value: {
        name,
        data,
      },
    }, this.parentOrigin)
  }

  post(name: string, data: any) {
    return new Promise((resolve) => {
      // Extract data from response and kill listeners
      const uid = generateNewMessageId()
      const transact = (e: any) => {
        if (e.data.uid === uid && e.data.postmate === 'reply') {
          this.child.removeEventListener('message', transact, false)
          resolve(e.data.value)
        }
      }

      // Prepare for response from Child...
      this.child.addEventListener('message', transact, false)

      this.parent.postMessage({
        postmate: 'sub-post',
        type: this.messageType,
        uid,
        value: {
          name,
          data,
        },
      }, this.parentOrigin)
    })
  }
}

export interface ParentInitData {
  /**
   * iframe容器节点
   */
  container: HTMLElement
  /**
   * iframe url
   */
  url: string
  /**
   * iframe name
   */
  name: string
  /**
   * iframe class list
   */
  classListArray?: string[]
  model?: Record<string, unknown>
}

/**
 * The entry point of the Parent.
 * @type {Class}
 */
class Postmate {
  parent?: Window & typeof globalThis
  container: HTMLElement
  url: string
  name: string
  classListArray: string[]
  frame?: HTMLIFrameElement
  child?: any
  model?: any
  messageType: string
  childOrigin?: any
  static Model: any
  static Promise: any

  /**
   * Sets options related to the Parent
   * @param {object} object The element to inject the frame into, and the url
   * @return {Promise}
   */
  constructor(data: ParentInitData) {
    const { container, model, url, name, classListArray } = data
    this.messageType = `${Date.now()}${Math.random()}`
    this.parent = window
    this.url = url
    this.container = container
    this.name = name
    this.classListArray = classListArray ?? []
    this.frame = document.createElement('iframe')
    this.frame.name = name || ''

    this.frame.classList.add(...this.classListArray);
    (container || document.body).appendChild(this.frame)
    this.child = this.frame.contentWindow
    this.model = model || {}
    // @ts-expect-error ignore
    return this.sendHandshake(url)
  }

  /**
   * Begins the handshake strategy
   * @param  {string} url The URL to send a handshake request to
   * @return {Promise}     Promise that resolves when the handshake is complete
   */
  sendHandshake(url: string) {
    const childOrigin = resolveOrigin(url)
    let attempt = 0
    let responseInterval: NodeJS.Timeout
    return new Promise<ParentAPI>((resolve, reject) => {
      const reply = (e: any) => {
        console.log('replay', e, this.messageType)
        if (!sanitize(e, childOrigin, this.messageType))
          return false
        if (e.data.postmate === 'handshake-reply') {
          clearInterval(responseInterval)
          log('Parent: Received handshake reply from Child')
          this.parent!.removeEventListener('message', reply, false)
          this.childOrigin = e.origin
          log('Parent: Saving Child origin', this.childOrigin)

          return resolve(new ParentAPI(this))
        }
        // Might need to remove since parent might be receiving different messages
        // from different hosts
        log('Parent: Invalid handshake reply')
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject('Failed handshake')
      }

      this.parent!.addEventListener('message', reply, false)
      const doSend = () => {
        attempt++
        log(`Parent: Sending handshake attempt ${attempt}`, { childOrigin })
        this.child.postMessage({
          postmate: 'handshake',
          type: this.messageType,
          model: this.model,
        }, childOrigin)
        if (attempt === maxHandshakeRequests)
          clearInterval(responseInterval)
      }

      const loaded = () => {
        doSend()
        responseInterval = setInterval(doSend, 1000)
      }
      this.frame!.addEventListener('load', loaded)
      log('Parent: Loading frame', { url })
      this.frame!.src = url
    })
  }
}

/**
 * The entry point of the Child
 * @type {Class}
 */
Postmate.Model = class Model {
  child: Window & typeof globalThis
  model: any
  parent: any
  parentOrigin: any
  messageType?: string
  /**
   * Initializes the child, model, parent, and responds to the Parents handshake
   * @param {object} model Hash of values, functions, or promises
   * @return {Promise}       The Promise that resolves when the handshake has been received
   */
  constructor(model: any) {
    this.child = window
    this.model = model
    this.parent = this.child.parent
    // @ts-expect-error ignore
    return this.sendHandshakeReply()
  }

  /**
   * Responds to a handshake initiated by the Parent
   * @return {Promise} Resolves an object that exposes an API for the Child
   */
  sendHandshakeReply() {
    return new Promise((resolve, reject) => {
      const shake = (e: any) => {
        console.log('rrrr', e)
        if (!e.data.postmate)
          return

        if (e.data.postmate === 'handshake') {
          log('Child: Received handshake from Parent')
          this.messageType = e.data.type

          this.child.removeEventListener('message', shake, false)
          log('Child: Sending handshake reply to Parent')

          e.source.postMessage({
            postmate: 'handshake-reply',
            type: this.messageType,
          }, e.origin)
          this.parentOrigin = e.origin

          // Extend model with the one provided by the parent
          const defaults = e.data.model
          if (defaults) {
            Object.keys(defaults).forEach((key) => {
              this.model[key] = defaults[key]
            })
            log('Child: Inherited and extended model from Parent')
          }

          log('Child: Saving Parent origin', this.parentOrigin)

          return resolve(new ChildAPI(this))
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject('Handshake Reply Failed')
      }
      this.child.addEventListener('message', shake, false)
    })
  }
}

export { Postmate }
