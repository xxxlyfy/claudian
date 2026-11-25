# 本地改动说明

这个仓库是 [Yishen Tu/claudian](https://github.com/YishenTu/claudian) 的复刻，仅供个人使用。
以下三处改动叠加在上游 2.3.48 之上，不会提交给上游。

## 1. 输入框静止高度 48px → 96px

- 涉及：`src/style/components/composer-editor.css`
- 原因：空着时只够约两行，太矮；改为约五行。
- 行为不变的部分：输入内容变多时仍会自动向上增高，上限仍是窗口高度的 40%（至少 150px），到上限后内部滚动。

## 2. 附带笔记标签移到输入框内左上角

- 涉及：`src/features/chat/tabs/runtime/TabRuntimeCore.ts`、`src/features/chat/composer/ComposerInfoRow.ts`、`src/style/components/composer-info-row.css`
- 原因：信息行原本挂在输入框下方，希望它成为输入框的一部分。
- 附带处理：没有项目、也没有附带笔记时整行收起（`claudian-input-info-row--empty`），否则输入框顶部会永久留一条空白带。
- 不受影响：禅（zen）模式下这一行仍按原样隐藏。

## 3. 聊天字号滑块下限 80% → 40%

- 涉及：`src/features/settings/ClaudianSettings.ts`
- 原因：滑块是「笔记字号 × 百分比」。Obsidian 基础字号为 22px 时，80% 仍有 17.6px，偏大。
- 参考：22px 基础字号下，60% ≈ 13.2px，55% ≈ 12.1px，40% ≈ 8.8px。

## 构建与安装

```bash
npm install
npm run build        # 生成 main.js、styles.css
```

产物已一并提交，可以直接把 `main.js`、`manifest.json`、`styles.css` 放进
`.obsidian/plugins/claudian/`，也可以交给 BRAT 从本仓库安装。

## 与上游同步时注意

三处改动都很局部，正常情况下可以直接重放到新版本上。若上游改动了同一处：

1. 输入框高度：改的是 `min-height` 两处（编辑器与内容区），需同时改；
2. 信息行位置：改的是信息行在界面树里的挂载位置，以及它的内边距；
3. 字号下限：改的是 `setLimits(40, 120, 5)` 的第一个数字。

改完务必重新 `npm run build`，并把新产物复制进 vault，否则界面仍是旧版本。
