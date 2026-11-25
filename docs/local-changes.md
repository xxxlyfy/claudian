# 本地改动说明

这个仓库是 [Yishen Tu/claudian](https://github.com/YishenTu/claudian) 的复刻，仅供个人使用。
以下三处改动叠加在上游 2.3.48 之上，不会提交给上游。

## 1. 输入框静止高度 48px → 96px

- 涉及：`src/style/components/composer-editor.css`
- 原因：空着时只够约两行，太矮；改为约五行。
- 行为不变：输入内容变多时仍会自动向上增高，上限仍是窗口高度的 40%（至少 150px），到上限后内部滚动。

## 2. 附带笔记标签移到输入框内左上角

- 涉及：`src/features/chat/tabs/runtime/TabRuntimeCore.ts`、`src/features/chat/composer/ComposerInfoRow.ts`、`src/style/components/composer-info-row.css`
- 原因：信息行原本挂在输入框下方，希望它成为输入框的一部分。
- 附带处理：没有项目、也没有附带笔记时整行收起（`claudian-input-info-row--empty`），否则输入框顶部会永久留一条空白带。
- 不受影响：禅（zen）模式下这一行仍按原样隐藏。

## 3. 聊天字号滑块下限 80% → 40%

- 涉及：`src/features/settings/ClaudianSettings.ts`
- 原因：滑块是「笔记字号 × 百分比」。Obsidian 基础字号为 22px 时，80% 仍有 17.6px，偏大。
- 参考：22px 基础字号下，60% ≈ 13.2px，55% ≈ 12.1px，40% ≈ 8.8px。

## 三处改动的精确位置

上游更新后若出现冲突，按这三条逐项核对：

1. **输入框高度**：`src/style/components/composer-editor.css` 里 `.claudian-composer-editor` 和
   `.claudian-composer-editor .cm-content` 两处的 `min-height`，当前都是 `96px`。
2. **信息行位置**：
   - `src/features/chat/tabs/runtime/TabRuntimeCore.ts`：信息行从 `inputContainerEl` 改挂到
     `inputWrapper`，位置在 `.claudian-context-row` 之后、编辑器之前；
   - `src/features/chat/composer/ComposerInfoRow.ts`：行内容为空时添加
     `claudian-input-info-row--empty`；
   - `src/style/components/composer-info-row.css`：内边距改为 `8px 8px 0`，并新增 `--empty` 的隐藏规则。
3. **字号下限**：`src/features/settings/ClaudianSettings.ts` 里的 `slider.setLimits(40, 120, 5)`。

## 构建与安装

```bash
npm install
npm run build        # 生成 main.js、styles.css
```

产物不进版本库，统一发布在发布页：<https://github.com/xxxlyfy/claudian/releases>。
安装时把 `main.js`、`manifest.json`、`styles.css` 放进 `.obsidian/plugins/claudian/`，
也可以交给 BRAT 从本仓库安装（它会取最新发布里的附件）。

## 上游更新时如何保留这些改动

操作者只需要说一句，例如「同步上游，保留我的改动」。执行者按下面步骤操作。

1. 重新拉取本仓库（包含三条改动记录）：
   `git clone https://github.com/xxxlyfy/claudian.git D:\claudian`
2. 记录上游地址：`git remote add upstream https://github.com/YishenTu/claudian.git`
3. 取回上游最新：`git fetch upstream`
4. 把三条改动重放到新版本之上：`git rebase upstream/main`
   - 冲突只会出现在这一步，按上面「精确位置」逐项对齐；
   - 若上游也改了同一处，先问用户保留哪边，不要擅自决定。
5. 重新构建：`npm install && npm run build`
6. 复制 `main.js`、`manifest.json`、`styles.css` 到
   `C:\Users\zcooo\OneDrive\Obsidian\.obsidian\plugins\claudian\`。
7. 打新标签并推送（rebase 后历史被整理，需要覆盖远端）：
   `git tag -a 2.3.48-local.N -m "同步上游后的本地改动版"`
   `git push --force-with-lease origin main`
   `git push origin 2.3.48-local.N`
8. 在发布页新建对应的发布，上传三个附件。
9. 重载 Obsidian（`Ctrl+R`），确认输入框高度、标签位置、字号下限三处仍然生效。

## 其他约定

- 本仓库的 GitHub 自动检查（Actions）保持禁用，不需要启用。
- 不要修改 `manifest.json` 的 `id`（`realclaudian`），否则已装插件的设置会认不出来。
- 插件设置存放在 vault 根目录的 `.claudian/claudian-settings.json`，重新安装不会丢。
