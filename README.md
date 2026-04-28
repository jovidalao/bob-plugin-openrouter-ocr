# Bob Plugin · OpenRouter OCR

Provides OCR (Optical Character Recognition) capabilities for [Bob](https://bobtranslate.com) by leveraging vision models via [OpenRouter](https://openrouter.ai). It defaults to the free `baidu/qianfan-ocr-fast:free` model, and you can switch to any vision model that supports image input on OpenRouter at any time in the plugin settings.

## Features

- Reuse OpenRouter's unified API directly without needing to apply for separate OCR Keys from other providers.
- Uses `baidu/qianfan-ocr-fast:free` by default, allowing you to use it at zero cost.
- Both the model and the prompt can be freely customized in the plugin settings.
- Automatically recognizes common image formats like PNG / JPEG / GIF / WebP / BMP.
- Provides an API Key verification button for one-click validation after configuration.

## Installation

1. Go to [Releases](https://github.com/jovidalao/bob-plugin-openrouter-ocr/releases) to download the latest `openrouter-ocr.bobplugin` file, or directly use the `openrouter-ocr.bobplugin` in the root directory of the repository.
2. Double-click the `.bobplugin` file, and Bob will automatically pop up an installation confirmation window.
3. Add the **OpenRouter OCR** service in Bob → Preferences → Services → OCR.

## Configuration

| Option | Required | Description |
| --- | --- | --- |
| API Key | Yes | Create and copy-paste it from [https://openrouter.ai/keys](https://openrouter.ai/keys) |
| Model | No | Default is `baidu/qianfan-ocr-fast:free`, can be changed to other vision model IDs |
| Prompt | No | The default prompt asks the model to return plain text only, can be adjusted as needed |

After entering the API Key, it is recommended to click the "Verify" button in the bottom right corner of the settings page to confirm the Key is valid.

## Recommended Models

- `baidu/qianfan-ocr-fast:free` — Default, free, fast, suitable for daily OCR tasks
- `qwen/qwen2.5-vl-72b-instruct` — General vision model, more stable performance but costs credits
- `google/gemini-2.0-flash-001` — Excellent comprehensive multi-modal model

For a complete list of models, see [OpenRouter Models](https://openrouter.ai/models?modality=text%2Bimage-%3Etext).

## Build from Source

The repository root is the plugin directory. Simply package `info.json` and `main.js`:

```bash
zip -r openrouter-ocr.bobplugin info.json main.js
```

Double-click the resulting `openrouter-ocr.bobplugin` to install.

## Acknowledgments

- [Bob](https://bobtranslate.com) — A macOS translation/OCR tool providing the plugin mechanism
- [OpenRouter](https://openrouter.ai) — A unified multi-model API gateway
