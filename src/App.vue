<template>
  <div class="app">
    <a-layout class="layout">
      <a-layout-header class="header">
        <div class="header-content">
          <h1 class="title">🎡 幸运转盘</h1>
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
            
            <a-card title="快捷选项" :bordered="false" style="margin-top: 16px">
              <div class="quick-options-container">
                <div 
                  v-for="preset in presetOptions" 
                  :key="preset.id"
                  class="quick-option-item"
                  @click="addQuickOption(preset)"
                >
                  <div class="quick-option-color" :style="{ backgroundColor: preset.color }"></div>
                  <div class="quick-option-name">{{ preset.name }}</div>
                </div>
              </div>
            </a-card>
            
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
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
  { id: 'p1', name: '新疆炒米粉', color: '#FF6B6B' },
  { id: 'p2', name: '螺蛳粉', color: '#4ECDC4' },
  { id: 'p3', name: '火鸡面', color: '#45B7D1' },
  { id: 'p4', name: '新疆拌面', color: '#96CEB4' },
  { id: 'p5', name: '汉堡', color: '#FFEAA7' },
  { id: 'p6', name: '炸鸡', color: '#DDA0DD' },
  { id: 'p7', name: '炒河粉', color: '#98D8C8' },
  { id: 'p8', name: '鸡蛋发', color: '#F7DC6F' },
  { id: 'p9', name: '米线', color: '#BB8FCE' },
  { id: 'p10', name: '冒菜', color: '#85C1E9' },
  { id: 'p11', name: '一点点', color: '#F8B500' },
  { id: 'p12', name: '茉莉奶白', color: '#00CED1' },
  { id: 'p13', name: '霸王茶姬', color: '#FF6B6B' },
  { id: 'p14', name: '茶颜悦色', color: '#4ECDC4' },
  { id: 'p15', name: '古茗', color: '#45B7D1' },
  { id: 'p16', name: '五谷渔粉', color: '#96CEB4' },
  { id: 'p17', name: '炒饭', color: '#FFEAA7' },
  { id: 'p18', name: '奶茶', color: '#DDA0DD' },
  { id: 'p19', name: '蛋糕', color: '#98D8C8' },
  { id: 'p20', name: '火鸡面', color: '#F7DC6F' },
  { id: 'p21', name: '意面', color: '#BB8FCE' },
  { id: 'p22', name: '桥头排骨', color: '#85C1E9' },
  { id: 'p23', name: '铁板饭', color: '#F8B500' },
  { id: 'p24', name: '特制面', color: '#00CED1' },
  { id: 'p25', name: '飘香牛肉面', color: '#FF6B6B' },
  { id: 'p26', name: '抓饭', color: '#4ECDC4' },
  { id: 'p27', name: '馄饨', color: '#45B7D1' },
  { id: 'p28', name: '披萨', color: '#96CEB4' },
  { id: 'p29', name: '酸辣粉', color: '#FFEAA7' },
  { id: 'p30', name: '寿司', color: '#DDA0DD' },
  { id: 'p31', name: '咖喱饭', color: '#98D8C8' },
  { id: 'p32', name: '瘦肉粥', color: '#F7DC6F' },
  { id: 'p33', name: '炒沙小肠', color: '#BB8FCE' },
  { id: 'p34', name: '烧烤', color: '#85C1E9' },
  { id: 'p35', name: '肯德基', color: '#F8B500' },
  { id: 'p36', name: '雪王奶', color: '#00CED1' },
  { id: 'p37', name: '兰州拉面', color: '#FF6B6B' },
  { id: 'p38', name: '瓦罐汤', color: '#4ECDC4' }
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

const addQuickOption = (preset: WheelOption) => {
  const newOption: WheelOption = {
    id: generateId(),
    name: preset.name,
    color: preset.color
  }
  options.value.push(newOption)
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

watch(options, () => {
  saveToLocalStorage()
}, { deep: true })
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  text-align: center;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
}

.content {
  padding: 20px 12px;
  background: rgba(255, 255, 255, 0.5);
  flex: 1;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

.wheel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 32px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.editor-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.quick-options-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background: #fafafa;
  border-radius: 8px;
}

.quick-option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.quick-option-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #165dff;
}

.quick-option-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-bottom: 6px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quick-option-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.footer {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px;
  color: #666;
  font-size: 12px;
}

.footer p {
  margin: 0;
}

@media (max-width: 900px) {
  .main-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .wheel-section {
    order: 1;
    padding: 20px 12px;
  }
  
  .editor-section {
    order: 2;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 22px;
  }
  
  .subtitle {
    font-size: 12px;
  }
  
  .content {
    padding: 12px 8px;
  }
  
  .wheel-section {
    padding: 16px 8px;
  }
  
  .editor-section {
    padding: 12px;
  }
  
  .header {
    padding: 12px 0;
  }
  
  .quick-options-container {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .quick-option-name {
    font-size: 12px;
  }
}
</style>

<style>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (max-width: 480px) {
  html {
    font-size: 14px;
  }
}
</style>