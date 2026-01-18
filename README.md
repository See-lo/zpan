# 幸运转盘 🎡

一个基于 Vue 3 + TypeScript + Arco Design 的幸运转盘应用，支持自定义选项和动态配置。

## ✨ 特性

- 🎨 完全自定义转盘选项（名称、颜色）
- 🔄 平滑的旋转动画效果
- 💾 自动保存配置到本地存储
- 📱 响应式设计，支持移动端
- 🎯 随机抽取结果
- 🚀 纯前端实现，无需后端

## 🛠️ 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - JavaScript 的超集
- Vite - 下一代前端构建工具
- Arco Design Vue - 字节跳动企业级 UI 组件库

## 📦 安装依赖

```bash
npm install
```

## 🚀 开发

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

## 🏗️ 构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录

## 🌐 部署到 Vercel

### 方法一：通过 Vercel CLI

1. 安装 Vercel CLI
```bash
npm install -g vercel
```

2. 登录 Vercel
```bash
vercel login
```

3. 部署
```bash
vercel
```

### 方法二：通过 GitHub

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 控制台中导入项目
3. Vercel 会自动检测配置并部署

## 📝 使用说明

1. **添加选项**：点击"添加选项"按钮，输入选项名称并选择颜色
2. **编辑选项**：直接修改选项名称或点击颜色选择器更改颜色
3. **删除选项**：点击删除按钮（至少保留 2 个选项）
4. **开始旋转**：点击"开始旋转"按钮，转盘将随机停止
5. **快捷操作**：
   - 恢复默认选项：重置为预设的 6 个选项
   - 清空所有选项：删除所有选项
   - 添加预设选项：添加 8 个预设的生活场景选项

## 🎨 自定义

转盘选项会自动保存到浏览器的本地存储中，下次访问时会自动加载。

## 📄 许可证

MIT