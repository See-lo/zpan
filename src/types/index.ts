export interface WheelOption {
  id: string
  name: string
  color: string
}

export interface WheelConfig {
  options: WheelOption[]
  spinning: boolean
  result: string | null
}