# 疯狂切 CrasyCut 官网

官网独立静态仓库，只包含网页、原创宣传素材和开发试玩 APK。游戏工程继续保留在 GitCode，不包含在此仓库中。

## 本地预览

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

打开 http://localhost:4173 。无需构建或安装依赖。

## 发布

GitHub Pages 使用 main 分支的根目录。更新文件后提交并推送 main，GitHub 自动发布。

安装包位于 downloads/CrasyCut.apk，是开发试玩快照，更新游戏工程不会自动替换本文件。
