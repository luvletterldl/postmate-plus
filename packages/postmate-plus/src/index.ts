import type { ChildAPI, ParentAPI, ParentInitData } from './postmate'
import { Postmate } from './postmate'

export { ParentInitData, ChildAPI, ParentAPI } from './postmate'
/**
 * 初始化子页面
 * @param model 提供给父页面的可获取的数据和方法，名称不限，自行和父级约定即可, 比如{ data: () => Math.random(), ... }
 */
export function initSubPage(option: { model: Record<string, unknown> }) {
  const handshake: Promise<ChildAPI> = new Postmate.Model(option.model)
  return handshake.then(p => p)
}

/**
 * 初始化父页面
 * @param option 初始化参数
 */
export function initParentPage(option: ParentInitData) {
  const { model, ...data } = option
  // @ts-expect-error ignore
  const handshake: Promise<ParentAPI> = new Postmate(data)
  // 拿到操作子页面的对象
  return handshake.then((c) => {
    if (model)
      c.model = model

    return c
  })
}
