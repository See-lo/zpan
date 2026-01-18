<template>
  <div class="wheel-container">
    <div class="wheel-wrapper" :style="{ transform: `rotate(${rotation}deg)` }">
      <svg :width="size" :height="size" viewBox="0 0 100 100">
        <g v-for="(option, index) in options" :key="option.id">
          <path
            :d="getSectorPath(index)"
            :fill="option.color"
            :stroke="strokeColor"
            :stroke-width="strokeWidth"
          />
          <text
            :x="getTextPosition(index).x"
            :y="getTextPosition(index).y"
            :fill="textColor"
            :font-size="fontSize"
            text-anchor="middle"
            dominant-baseline="middle"
            :transform="getTextRotation(index)"
          >
            {{ truncateText(option.name, maxTextLength) }}
          </text>
        </g>
      </svg>
    </div>
    <div class="wheel-pointer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { WheelOption } from '../types'

interface Props {
  options: WheelOption[]
  spinning?: boolean
  size?: number
  strokeColor?: string
  strokeWidth?: number
  textColor?: string
  fontSize?: number
  maxTextLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  spinning: false,
  size: 400,
  strokeColor: '#ffffff',
  strokeWidth: 0.5,
  textColor: '#ffffff',
  fontSize: 3,
  maxTextLength: 8
})

const emit = defineEmits<{
  spinEnd: [result: string]
}>()

const rotation = ref(0)
const currentRotation = ref(0)
const targetRotation = ref(0)

const sectorAngle = computed(() => 360 / props.options.length)

const getSectorPath = (index: number) => {
  const startAngle = index * sectorAngle.value
  const endAngle = (index + 1) * sectorAngle.value
  
  const startRad = (startAngle - 90) * (Math.PI / 180)
  const endRad = (endAngle - 90) * (Math.PI / 180)
  
  const x1 = 50 + 45 * Math.cos(startRad)
  const y1 = 50 + 45 * Math.sin(startRad)
  const x2 = 50 + 45 * Math.cos(endRad)
  const y2 = 50 + 45 * Math.sin(endRad)
  
  const largeArcFlag = sectorAngle.value > 180 ? 1 : 0
  
  return `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

const getTextPosition = (index: number) => {
  const angle = (index + 0.5) * sectorAngle.value - 90
  const rad = angle * (Math.PI / 180)
  const radius = 30
  
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad)
  }
}

const getTextRotation = (index: number) => {
  const angle = (index + 0.5) * sectorAngle.value
  return `rotate(${angle}, ${getTextPosition(index).x}, ${getTextPosition(index).y})`
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const spin = () => {
  if (props.spinning || props.options.length === 0) return
  
  const spins = 5 + Math.random() * 5
  const randomAngle = Math.random() * 360
  const totalRotation = spins * 360 + randomAngle
  
  targetRotation.value = currentRotation.value + totalRotation
  currentRotation.value = targetRotation.value
  
  const duration = 5000
  const startTime = performance.now()
  const startRotation = rotation.value
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const easeOut = 1 - Math.pow(1 - progress, 4)
    rotation.value = startRotation + (targetRotation.value - startRotation) * easeOut
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      const normalizedRotation = (rotation.value % 360 + 360) % 360
      const effectiveAngle = (360 - normalizedRotation) % 360
      const winningIndex = Math.floor(effectiveAngle / sectorAngle.value) % props.options.length
      
      if (props.options[winningIndex]) {
        emit('spinEnd', props.options[winningIndex].name)
      }
    }
  }
  
  requestAnimationFrame(animate)
}

watch(() => props.spinning, (newVal) => {
  if (newVal) {
    spin()
  }
})

defineExpose({
  spin
})
</script>

<style scoped>
.wheel-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.wheel-wrapper {
  transition: transform 0.1s ease-out;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.wheel-pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #ff6b6b;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  z-index: 10;
}
</style>