var langItems = [
    ['auto', 'auto'],
    ['zh-Hans', 'zh-Hans'],
    ['zh-Hant', 'zh-Hant'],
    ['en', 'en'],
    ['ja', 'ja'],
    ['ko', 'ko'],
    ['fr', 'fr'],
    ['de', 'de'],
    ['es', 'es'],
    ['it', 'it'],
    ['ru', 'ru'],
    ['pt', 'pt'],
    ['vi', 'vi'],
    ['th', 'th'],
    ['ar', 'ar']
];

function supportLanguages() {
    return langItems.map(function (item) { return item[0]; });
}

function detectImageMime(data) {
    if (!data || data.length < 4) return 'image/png';
    var b0 = data.readUInt8(0);
    var b1 = data.readUInt8(1);
    var b2 = data.readUInt8(2);
    var b3 = data.readUInt8(3);
    if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4E && b3 === 0x47) return 'image/png';
    if (b0 === 0xFF && b1 === 0xD8) return 'image/jpeg';
    if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46) return 'image/gif';
    if (b0 === 0x52 && b1 === 0x49 && b2 === 0x46 && b3 === 0x46) return 'image/webp';
    if (b0 === 0x42 && b1 === 0x4D) return 'image/bmp';
    return 'image/png';
}

function buildHeaders(apiKey) {
    return {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
    };
}

function ocr(query, completion) {
    var apiKey = ($option.apiKey || '').trim();
    if (!apiKey) {
        completion({
            error: {
                type: 'secretKey',
                message: '未填写 OpenRouter API Key',
                addition: '请在插件设置中填写 OpenRouter API Key（可在 https://openrouter.ai/keys 获取）'
            }
        });
        return;
    }

    var image = query.image;
    if (!image) {
        completion({
            error: {
                type: 'param',
                message: '未接收到图片数据'
            }
        });
        return;
    }

    var model = ($option.model || '').trim() || 'baidu/qianfan-ocr-fast:free';
    var prompt = ($option.prompt || '').trim()
        || '请提取图片中的所有文字。仅输出识别到的纯文本内容，按原始的段落与换行顺序排列，不要添加任何解释、说明或 Markdown 格式。';

    var mime = detectImageMime(image);
    var dataUrl = 'data:' + mime + ';base64,' + image.toBase64();

    var body = {
        model: model,
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'image_url', image_url: { url: dataUrl } }
                ]
            }
        ]
    };

    $http.request({
        method: 'POST',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        header: buildHeaders(apiKey),
        body: body,
        handler: function (resp) {
            if (resp.error) {
                completion({
                    error: {
                        type: 'network',
                        message: '请求 OpenRouter 失败：' + (resp.error.message || ''),
                        addition: resp.error
                    }
                });
                return;
            }

            var statusCode = resp.response && resp.response.statusCode;
            var data = resp.data;

            if (statusCode && statusCode >= 400) {
                var errMsg = '';
                if (data && typeof data === 'object' && data.error) {
                    errMsg = data.error.message || JSON.stringify(data.error);
                } else if (typeof data === 'string') {
                    errMsg = data;
                }
                var errType = (statusCode === 401 || statusCode === 403) ? 'secretKey' : 'api';
                completion({
                    error: {
                        type: errType,
                        message: 'OpenRouter 返回错误（HTTP ' + statusCode + '）：' + errMsg,
                        addition: data
                    }
                });
                return;
            }

            var content = null;
            try {
                content = data && data.choices && data.choices[0]
                    && data.choices[0].message && data.choices[0].message.content;
            } catch (e) {
                content = null;
            }

            if (typeof content !== 'string' || !content) {
                completion({
                    error: {
                        type: 'api',
                        message: 'OpenRouter 返回数据缺少识别内容',
                        addition: data
                    }
                });
                return;
            }

            var lines = content
                .replace(/\r\n/g, '\n')
                .split('\n')
                .map(function (l) { return l.replace(/\s+$/g, ''); })
                .filter(function (l) { return l.length > 0; });

            if (lines.length === 0) lines = [content];

            var texts = lines.map(function (l) { return { text: l }; });

            var result = { texts: texts, raw: data };
            var fromLang = (query.detectFrom && query.detectFrom !== 'auto')
                ? query.detectFrom
                : ((query.from && query.from !== 'auto') ? query.from : '');
            if (fromLang) result.from = fromLang;

            completion({ result: result });
        }
    });
}

function pluginValidate(completion) {
    var apiKey = ($option.apiKey || '').trim();
    if (!apiKey) {
        completion({
            result: false,
            error: {
                type: 'secretKey',
                message: '未填写 OpenRouter API Key'
            }
        });
        return;
    }

    $http.request({
        method: 'GET',
        url: 'https://openrouter.ai/api/v1/auth/key',
        header: { 'Authorization': 'Bearer ' + apiKey },
        handler: function (resp) {
            if (resp.error) {
                completion({
                    result: false,
                    error: {
                        type: 'network',
                        message: '验证请求失败：' + (resp.error.message || '')
                    }
                });
                return;
            }
            var statusCode = resp.response && resp.response.statusCode;
            if (statusCode === 200) {
                completion({ result: true });
            } else {
                completion({
                    result: false,
                    error: {
                        type: (statusCode === 401 || statusCode === 403) ? 'secretKey' : 'api',
                        message: 'API Key 验证失败（HTTP ' + statusCode + '）',
                        addition: resp.data
                    }
                });
            }
        }
    });
}

function pluginTimeoutInterval() {
    return 60;
}
