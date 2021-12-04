# meeting-board-server
M5Paper向けにGoogleカレンダーから取得したミーティング予定を載せた画像を生成するやつ
![screenshot](https://user-images.githubusercontent.com/13611993/144706168-ace7482e-4ea1-4064-80da-6baee3dc0f5e.jpg)
## 起動
```
docker-compose up -d
```

## 終了
```
docker-compose down
```

## レンダリング済み画像取得
```/api/screenshot```にリクエスト投げると960x540のpngが返ってくるはず

## 開発
### 起動
```
docker-compose -f docker-compose.dev.yml up
```
注意: こっちのモードの時は``appconfig.json``と``service-account-key.json``は``src/``に手動で配置すること
