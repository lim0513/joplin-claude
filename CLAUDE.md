
## npm 发布方式迁移备忘（截止 2027-01）

npm 安全策略收紧（github.blog changelog 2026-07-08）：

- 2026-08 起：绕过 2FA 的 token 不能再做账号/包管理操作（本仓库只用它 publish，无影响）
- **2027-01 起：绕过 2FA 的 token 不能再直接 npm publish —— 当前发布流程会失效**
- 届时迁移到 trusted publishing（OIDC）：GitHub Actions 打 tag 触发构建+发布，npm 包与仓库绑定，无需长期 token
- 当前流程：发布时写临时 .npmrc + Automation token（token 位置见 D:\repos\.npm-publish-token.txt，短期有效，过期找用户要新的）
- 另：npm v12 起 install 默认禁用依赖的 postinstall/git/remote —— 升级 npm 后构建异常先查这个（npm approve-scripts）
