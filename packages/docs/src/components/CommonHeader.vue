<script setup lang="ts">
</script>

<template>
  <header shadow z-10 bg-white dark:bg-bk sticky top-0 flex ic jb p-6>
    <router-link to="/">
      Common MQ SDK
    </router-link>
    <nav text-lg ic flex gap-6>
      <router-link to="/api">
        api
      </router-link>
      <router-link to="/playground">
        playground
      </router-link>
      <a target="_black" href="https://git.zuoyebang.cc/common-sdk/common-mq">
        <div i-carbon:logo-github />
      </a>
      <div cp dark:i-carbon-moon i-carbon-sun @click="toggleDark()" />
    </nav>
  </header>
</template>
