<template>
  <div class="spin-button-container">
    <a-button
      type="primary"
      size="large"
      :disabled="disabled || spinning"
      :loading="spinning"
      @click="handleSpin"
      class="spin-button"
    >
      <template #icon>
        <icon-sync :spin="spinning" />
      </template>
      {{ spinning ? '旋转中...' : buttonText }}
    </a-button>
    
    <a-modal
      v-model:visible="showResult"
      title="🎉 恭喜！"
      :footer="false"
      @ok="showResult = false"
    >
      <div class="result-content">
        <div class="result-icon">🎊</div>
        <div class="result-text">
          抽中结果：<span class="result-value">{{ result }}</span>
        </div>
      </div>
      <div class="result-actions">
        <a-button type="primary" long @click="showResult = false">
          确定
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconSync } from '@arco-design/web-vue/es/icon'

interface Props {
  disabled?: boolean
  spinning?: boolean
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  spinning: false,
  buttonText: '开始旋转'
})

const emit = defineEmits<{
  spin: []
}>()

const showResult = ref(false)
const result = ref('')

const handleSpin = () => {
  emit('spin')
}

const showResultModal = (resultText: string) => {
  result.value = resultText
  showResult.value = true
}

defineExpose({
  showResultModal
})
</script>

<style scoped>
.spin-button-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.spin-button {
  min-width: 200px;
  height: 60px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.result-content {
  text-align: center;
  padding: 20px 0;
}

.result-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.result-text {
  font-size: 18px;
  color: #333;
}

.result-value {
  font-size: 24px;
  font-weight: bold;
  color: #f53f3f;
  display: block;
  margin-top: 8px;
}

.result-actions {
  margin-top: 24px;
}
</style>