# azviewer-webapp-prototype

## はじめに

React 学習の一貫で、WEB+DB vol.97のReact特集をベースに、
過去作った Android アプリ azviewer(青空文庫ビューア)のウェブ版を作っていた。
Web API側は swagger を使用。

ある程度作った後しばらく放置していたせいで、最新版への追従が厳しくなったので、これで一旦打ち止め、公開することにした。

## 機能

- 人物別一覧表示
- 作品別一覧表示
- 作品表示
- 人物、作品検索
- ログイン機能、お気に入り
    - リリース版は機能を無効に

## デモ版

http://orbit.teknocat.jp/azviewer/ ※ログイン機能なし

## 構成

- `api/`
    - Web API(swagger)
- `front/`
    - フロントエンド(React/Redux/Bootstrap)

## 初期化

- mongoDB
- api

```
$ cd api
$ npm run download_csv  # 青空文庫から「公開中　作家別作品一覧拡充版：全て(CSV形式、UTF-8、zip圧縮）」をダウンロード
$ npm run initdb        # DB(mongoDB)の初期化
```

## 起動方法

### API起動

```
$ cd api
$ AZVIEWER_SECRET=xxxxxxx npm run start
```

### フロント起動

#### 開発版

```
$ cd front
$ npm run start
```

`http://localhost:8080/`

#### リリース版

リバースプロキシ(5000番ポート)経由で `http://localhost/azviewer` に配置される前提。

```
$ cd front
$ npm run build-prod
$ npm run start-prod
```