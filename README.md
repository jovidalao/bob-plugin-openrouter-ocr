# Bob Plugin · OpenRouter OCR

通过 [OpenRouter](https://openrouter.ai) 调用视觉大模型为 [Bob](https://bobtranslate.com) 提供 OCR 文字识别能力。默认使用免费的 `baidu/qianfan-ocr-fast:free` 模型，也可以在插件设置里随时切换为 OpenRouter 上任意一款支持图片输入的视觉模型。

## 功能特性

- 直接复用 OpenRouter 的统一接口，无需额外申请其他厂商的 OCR Key
- 默认使用 `baidu/qianfan-ocr-fast:free`，零成本即可使用
- 模型与提示词均可在插件设置里自由调整
- 自动识别 PNG / JPEG / GIF / WebP / BMP 等常见图片格式
- 提供 API Key 验证按钮，配置后一键校验

## 安装

1. 前往 [Releases](https://github.com/jovidalao/bob-plugin-openrouter-ocr/releases) 下载最新的 `openrouter-ocr.bobplugin` 文件，或直接使用仓库根目录的 `openrouter-ocr.bobplugin`。
2. 双击 `.bobplugin` 文件，Bob 会自动弹出安装确认窗口。
3. 在 Bob → 偏好设置 → 服务 → OCR 中添加 **OpenRouter OCR** 服务。

## 配置

| 选项 | 是否必填 | 说明 |
| --- | --- | --- |
| API Key | 必填 | 在 [https://openrouter.ai/keys](https://openrouter.ai/keys) 创建并复制粘贴 |
| 模型 | 选填 | 默认 `baidu/qianfan-ocr-fast:free`，可换成其他视觉模型 ID |
| Prompt | 选填 | 默认要求模型仅返回纯文本，可按需调整 |

填好 API Key 后建议点击设置页右下角的「验证」按钮确认 Key 可用。

## 推荐模型

- `baidu/qianfan-ocr-fast:free` — 默认，免费，速度快，适合日常 OCR
- `qwen/qwen2.5-vl-72b-instruct` — 通用视觉模型，效果更稳但有费用
- `google/gemini-2.0-flash-001` — 综合表现优秀的多模态模型

完整模型列表见 [OpenRouter Models](https://openrouter.ai/models?modality=text%2Bimage-%3Etext)。

## 从源码构建

仓库根目录就是插件目录，直接打包 `info.json` 与 `main.js` 即可：

```bash
zip -r openrouter-ocr.bobplugin info.json main.js
```

得到的 `openrouter-ocr.bobplugin` 双击即可安装。

## 鸣谢

- [Bob](https://bobtranslate.com) — 提供插件机制的 macOS 翻译/OCR 工具
- [OpenRouter](https://openrouter.ai) — 统一的多模型 API 网关
