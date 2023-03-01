<script lang="ts" setup>
import { autoResetRef, useProject, useThrottleFn } from '#imports'
const { size = useProject().backendEnv?.ICON_WIDTH || process.env.ICON_WIDTH, animate = false } = defineProps<Props>()
const iconURL = useProject().backendEnv?.ICON_URL || process.env.ICON_URL
interface Props {
  size?: number
  animate?: boolean
}

const ping = autoResetRef(false, 1000)

const onClick = useThrottleFn(() => {
  ping.value = true
}, 1000)
</script>

<template>
  <div
    :style="{ left: `calc(50% - ${size / 2}px)`, top: `-${size / 2}px` }"
    class="color-transition absolute rounded-lg pt-1 pl-1 -ml-1"
    @click="onClick"
  >
    <div class="relative">
      <!--      <img class="hidden dark:block" :width="size" :height="size" alt="NocoDB" src="~/assets/img/icons/512x512-trans.png" /> -->
      <img class="dark:hidden" :width="size" :height="size" alt="NocoDB" :src="iconURL" />

      <TransitionGroup name="layout" :duration="500">
        <template v-if="animate || ping">
          <div
            :class="ping ? 'bg-primary bg-opacity-100' : 'animated-bg-gradient'"
            :style="{
              bottom: `${6.25 / (90 / size)}px`,
              right: `${6.25 / (90 / size)}px`,
              width: `${1.1 / (90 / size)}rem`,
              height: `${1.1 / (90 / size)}rem`,
            }"
            class="rounded-full z-0 absolute transform scale-102"
          />
          <div
            :style="{
              bottom: `${0.225 / (90 / size)}rem`,
              right: `${0.25 / (90 / size)}rem`,
              width: `${1.375 / (90 / size)}rem`,
              height: `${1.375 / (90 / size)}rem`,
            }"
            class="animate-ping bg-primary bg-opacity-50 rounded-full z-0 absolute"
          />
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>
