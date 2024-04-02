<script setup lang="ts">
import type { ParentAPI } from 'postmate-plus'
import { initParentPage } from 'postmate-plus'
import { ElMessage } from 'element-plus'
import CommonIframe from '../../../README.md'
import CommonIframeMuti from '../../../README-Muti.md'

const targetRef = ref()
const isMuti = ref(false)
const parentPageData = ref('send data to child')

const childList = ref<ParentAPI[]>([])

// 初始化子页面
async function parentPage() {
  const child = await initParentPage({
    // 存放iframe的容器
    container: targetRef.value,
    // iframe的url
    url: `${location.origin}/documents/common-mq/#/inside`,
    // 可选参数，设置iframe的名称
    name: 'my-iframe-name',
    // 可选参数，给iframe设置class
    classListArray: ['myClass'],
    // 暴露给子异步的方法调用，用于子传递给父数据，父处理完成返回给子结果
    model: {
      asyncSubPost: (data: any) => {
        // 这里不一定非要返回Promise，这里只是作为示例演示异步效果
        return new Promise((resolve) => {
          const info = `Sub Post: parent received data from child: ${data}`
          ElMessage.success(info)
          console.log(info)
          setTimeout(() => {
            resolve(`parent resolve data to child ${data}`)
          }, 3000)
        })
      },
    },
  })
  // 设置iframe的样式
  document.querySelectorAll('.myClass').forEach((el) => {
    el.width = '100%'
    el.height = '150px'
  })
  child.on('some-event', (e: unknown) => ElMessage.success(`子页面触发父页面定义的事件，收到数据${e}`))
  childList.value.push(child)
}

// 调用子页面提供的方法
function callIframe(index: number) {
  ElMessage.success(`父页面调用子页面提供的方法，发送数据${parentPageData.value}`)
  childList.value[index]!.call('sayHi', parentPageData.value)
}

function postIframe(index: number) {
  childList.value[index]!.post('asyncData', parentPageData.value).then((res: unknown) => {
    const info = `Post Received From Child: ${res}`
    ElMessage.success(info)
    console.log(info)
  })
}

// 获取子页面的数据
function getChildData(index: number) {
  childList.value[index]!.get('data').then((res: unknown) => {
    const info = `get child data: ${res}`
    ElMessage.success(info)
    console.log(info)
  })
}

// 销毁子页面
function destroyIframe(index: number) {
  childList.value[index]!.destroy()
  childList.value.splice(index, 1)
}
</script>

<template>
  <main p-12px>
    <div text="3xl red" flex ic jb>
      <p>Outside 外层</p>
      <div inline-black ml-3 dark:i-carbon:sun i-carbon:moon cp @click="toggleDark()" />
    </div>
    <div>
      <el-button :disabled="isMuti ? false : childList.length > 0" @click="parentPage">
        初始化
      </el-button>
      <div v-for="(_, index) in childList" :key="index" flex ic gap-12px my-3>
        <el-button @click="callIframe(index)">
          调用iframe方法 call
        </el-button>
        <el-button @click="postIframe(index)">
          调用iframe方法 post <div ml-3 i-carbon:update-now />
        </el-button>
        <el-button @click="getChildData(index)">
          获取iframe数据 get <div ml-3 i-carbon:update-now />
        </el-button>
        <el-button @click="destroyIframe(index)">
          destroyIframe
        </el-button>
        <el-form inline>
          <el-form-item w-400px label="发送给子页面的数据">
            <el-input v-model="parentPageData" placeholder="请输入要发送给子页面的数据" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div ref="targetRef" rounded overflow-hidden mx-5vw my-6 w-90vw :style="{ height: `${150 * childList.length}px` }" />
    <p>支持创建多个iframe，每个iframe和父页面通信隔离！</p>
    <el-switch
      v-model="isMuti"
      size="large"
      active-text="多iframe实例"
      inactive-text="单iframe实例"
    />
    <details open>
      <summary>
        快速开始
      </summary>
      <CommonIframeMuti v-if="isMuti" />
      <CommonIframe v-else />
    </details>
  </main>
</template>
