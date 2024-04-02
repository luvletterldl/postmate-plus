<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { markMsg } from '../modules/utils'

const props = defineProps<{
  channel: string
  role: string
}>()
const { channel, post, close, data, error } = useBroadcastChannel({ name: props.channel })

const msg = ref('')

const { copy } = useClipboard()

function send() {
  post(msg.value)
}

function copyAction() {
  copy(data.value as string)
  ElMessage.success('copied')
}

onUnmounted(() => close())
</script>

<template>
  <div w-full h-full>
    <div>
      <p>channel: <span text="lg bold pink-600">{{ channel?.name }}</span></p>
    </div>
    <div flex gap-3>
      <el-input v-model="msg" placeholder="请输入要发送的内容" type="textarea" />
      <el-button @click="send">
        发送
      </el-button>
    </div>
    <div v-if="data" flex gap-3 mt-3>
      received:
      <div text="lg" mr-3 cp i-carbon:copy @click="copyAction" />
      <div v-html="(data as string).includes(props.role) ? markMsg(data as string) : ''" />
    </div>
    <div v-if="error">
      error: {{ error }}
    </div>
  </div>
</template>
