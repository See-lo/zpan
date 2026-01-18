<template>
  <div class="option-editor">
    <a-card title="转盘选项" :bordered="false">
      <template #extra>
        <a-space>
          <a-button type="primary" size="small" @click="addOption">
            <template #icon>
              <icon-plus />
            </template>
            添加选项
          </a-button>
          
          <a-button size="small" @click="saveAsDefault">
            <template #icon>
              <icon-save />
            </template>
            保存选项
          </a-button>
        </a-space>
      </template>
      
      <div class="options-list">
        <div
          v-for="(option, index) in options"
          :key="option.id"
          class="option-item"
        >
          <div class="option-color">
            <a-color-picker
              v-model="option.color"
              :show-preview="true"
              @change="updateOption(index, 'color', $event)"
            />
          </div>
          
          <div class="option-name">
            <a-input
              v-model="option.name"
              placeholder="选项名称"
              @input="updateOption(index, 'name', $event)"
            />
          </div>
          
          <div class="option-actions">
            <a-button
              type="text"
              status="danger"
              :disabled="options.length <= 2"
              @click="removeOption(index)"
            >
              <template #icon>
                <icon-delete />
              </template>
            </a-button>
          </div>
        </div>
      </div>
      
      <a-alert
        v-if="options.length < 2"
        type="warning"
        style="margin-top: 16px"
      >
        至少需要 2 个选项才能开始旋转
      </a-alert>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconPlus, IconDelete, IconSave } from '@arco-design/web-vue/es/icon'
import type { WheelOption } from '../types'

interface Props {
  modelValue: WheelOption[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: WheelOption[]]
  'save-as-default': [options: WheelOption[]]
}>()

const options = ref<WheelOption[]>([...props.modelValue])

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
]

const generateId = () => {
  return `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const addOption = () => {
  const colorIndex = options.value.length % defaultColors.length
  const newOption: WheelOption = {
    id: generateId(),
    name: `选项 ${options.value.length + 1}`,
    color: defaultColors[colorIndex]
  }
  options.value.push(newOption)
  emitUpdate()
}

const removeOption = (index: number) => {
  if (options.value.length > 2) {
    options.value.splice(index, 1)
    emitUpdate()
  }
}

const updateOption = (index: number, field: keyof WheelOption, value: any) => {
  options.value[index][field] = value
  emitUpdate()
}

const saveAsDefault = () => {
  emit('save-as-default', [...options.value])
}

const emitUpdate = () => {
  emit('update:modelValue', [...options.value])
}

watch(() => props.modelValue, (newVal) => {
  options.value = [...newVal]
}, { deep: true })
</script>

<style scoped>
.option-editor {
  width: 100%;
  max-width: 500px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 350px;
  overflow-y: auto;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: all 0.2s;
}

.option-item:hover {
  background: #e8e8e8;
}

.option-color {
  flex-shrink: 0;
}

.option-name {
  flex: 1;
  min-width: 0;
}

.option-actions {
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .options-list {
    gap: 8px;
    max-height: 300px;
  }
  
  .option-item {
    gap: 6px;
    padding: 4px;
  }
  
  .option-editor :deep(.arco-card) {
    border-radius: 12px;
  }
  
  .option-editor :deep(.arco-card-body) {
    padding: 12px;
  }
}
</style>