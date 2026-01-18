<template>
  <div class="app">
    <a-layout class="layout">
      <a-layout-header class="header">
        <div class="header-content">
          <h1 class="title">🎡 幸运转盘</h1>
          <p class="subtitle">自定义选项，随机抽取</p>
        </div>
      </a-layout-header>
      
      <a-layout-content class="content">
        <div class="main-container">
          <div class="wheel-section">
            <WheelSpinner
              ref="wheelRef"
              :options="options"
              :spinning="spinning"
              @spin-end="handleSpinEnd"
            />
            
            <SpinButton
              ref="spinButtonRef"
              :disabled="options.length < 2"
              :spinning="spinning"
              @spin="handleSpin"
            />
          </div>
          
          <div class="editor-section">
            <OptionEditor v-model="options" />
            
            <a-card title="快捷操作" :bordered="false" style="margin-top: 16px">
              <a-space direction="vertical" :size="12" fill>
                <a-button long @click="resetToDefault">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  恢复默认选项
                </a-button>
                
                <a-button long @click="clearAll">
                  <template #icon>
                    <icon-delete />
                  </template>
                  清空所有选项
                </a-button>
                
                <a-button long @click="addPresetOptions">
                  <template #icon>
                    <icon-plus />
                  </template>
                  添加预设选项
                </a-button>
              </a-space>
            </a-card>
          </div>
        </div>
      </a-layout-content>
      
      <a-layout-footer class="footer">
        <p>© 2024 幸运转盘 | 使用 Vue 3 + Arco Design 构建</p>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconRefresh, IconDelete, IconPlus } from '@arco-design/web-vue/es/icon'
import WheelSpinner from './components/WheelSpinner.vue'
import OptionEditor from './components/OptionEditor.vue'
import SpinButton from './components/SpinButton.vue'
import type { WheelOption } from './types'

const wheelRef = ref<InstanceType<typeof WheelSpinner>>()
const spinButtonRef = ref<InstanceType<typeof SpinButton>>()
const spinning = ref(false)
const options = ref<WheelOption[]>([])

const defaultOptions: WheelOption[] = [
  { id: '1', name: '一等奖', color: '#FF6B6B' },
  { id: '2', name: '二等奖', color: '#4ECDC4' },
  { id: '3', name: '三等奖', color: '#45B7D1' },
  { id: '4', name: '谢谢参与', color: '#96CEB4' },
  { id: '5', name: '再来一次', color: '#FFEAA7' },
  { id: '6', name: '神秘大奖', color: '#DDA0DD' }
]

const presetOptions: WheelOption[] = [
  { id: 'p1', name: '吃火锅', color: '#FF6B6B' },
  { id: 'p2', name: '看电影', color: '#4ECDC4' },
  { id: 'p3', name: '去公园', color: '#45B7D1' },
  { id: 'p4', name: '打游戏', color: '#96CEB4' },
  { id: 'p5', name: '看书', color: '#FFEAA7' },
  { id: 'p6', name: '运动', color: '#DDA0DD' },
  { id: 'p7', name: '听音乐', color: '#98D8C8' },
  { id: 'p8', name: '睡觉', color: '#F7DC6F' }
]

const generateId = () => {
  return `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const handleSpin = () => {
  if (spinning.value || options.value.length < 2) return
  spinning.value = true
  wheelRef.value?.spin()
}

const handleSpinEnd = (result: string) => {
  spinning.value = false
  spinButtonRef.value?.showResultModal(result)
}

const resetToDefault = () => {
  options.value = defaultOptions.map(opt => ({ ...opt, id: generateId() }))
  saveToLocalStorage()
}

const clearAll = () => {
  options.value = []
  saveToLocalStorage()
}

const addPresetOptions = () => {
  const newOptions = presetOptions.map(opt => ({ ...opt, id: generateId() }))
  options.value = [...options.value, ...newOptions]
  saveToLocalStorage()
}

const saveToLocalStorage = () => {
  localStorage.setItem('wheel-options', JSON.stringify(options.value))
}

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('wheel-options')
  if (saved) {
    try {
      options.value = JSON.parse(saved)
    } catch (e) {
      options.value = defaultOptions.map(opt => ({ ...opt, id: generateId() }))
    }
  } else {
    options.value = defaultOptions.map(opt => ({ ...opt, id: generateId() }))
  }
}

onMounted(() => {
  loadFromLocalStorage()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.layout {
  min-height: 100vh;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 8px 0 0 0;
}

.content {
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.5);
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
}

.wheel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.editor-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.footer {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  color: #666;
}

.footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .main-container {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 24px;
  }
  
  .wheel-section {
    padding: 20px;
  }
}
</style>