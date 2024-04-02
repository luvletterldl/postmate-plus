<script setup lang="ts">
import { initSubPage } from 'postmate-plus'
import type { ChildAPI } from 'postmate-plus'

const subPageData = ref('data from child')
const parent = ref<ChildAPI>()

function sayHi(e: unknown) {
  ElMessage.success(`父页面调用子页面方法，传递的数据：${e}`)
}

async function subPage() {
  parent.value = await initSubPage({
    // 提供给父页面的可获取的数据和方法，名称不限，自行和父级约定即可
    model: {
      data: () => {
        // 这里不一定非要返回Promise，这里只是作为示例演示异步效果
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(subPageData.value)
          }, 2000)
        })
      },
      asyncData: (data: any) => {
        const info = `Post: child received data from parent: ${JSON.stringify(data)}`
        ElMessage.success(info)
        // 这里不一定非要返回Promise，这里只是作为示例演示异步效果
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(subPageData.value)
          }, 2000)
        })
      },
      sayHi,
    },
  })
}

function postParent() {
  ElMessage.success(`触发父页面on的事件，发送数据${subPageData.value}`)
  parent.value!.emit('some-event', subPageData.value)
}

function postAsyncParent() {
  parent.value!.post('asyncSubPost', subPageData.value).then((res: unknown) => {
    const result = `Sub Post Received From Parent: ${res}`
    ElMessage.success(result)
    console.log(result)
  })
}

subPage()
</script>

<template>
  <main w-full h-150px p-3 rounded>
    <p text="3xl red">
      Inside iframe
    </p>
    <div flex ic gap-14px>
      <el-button @click="postParent">
        抛出事件 emit
      </el-button>
      <el-button @click="postAsyncParent">
        抛出事件 post <div ml-3 i-carbon:update-now />
      </el-button>
      <el-form inline>
        <el-form-item w-400px label="发送给父页面的数据">
          <el-input v-model="subPageData" placeholder="请输入要发送给父页面的数据" />
        </el-form-item>
      </el-form>
    </div>
  </main>
</template>
