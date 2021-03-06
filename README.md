# コミュSHOW

[![Product Name](https://raw.githubusercontent.com/jphacks/KB_1705/master/presentation.JPG)](https://youtu.be/_fIvt16P6AI)

## 製品概要
CommunicationxTech
- コミュ障によるコミュ障のためのコミュ障のコミュニケーション改善ツール

### 背景（製品開発のきっかけ、課題等）
- 今回のプロダクトの開発に至った背景
チームメンバー6人うちコミュ障が5人いるため，コミュニケーション能力を改善する必要を感じた．
ハロウィーンやクリスマスを控え，身近に寄り添ってもらえる誰かを探すために行動に出るコミュ障の"キミ"を助けとなるべく開発を試みた．

- 着目した顧客・顧客の課題・現状
コミュ障のあなた（友達，恋人，知り合いがいない人）
人との話し方が分からない人
においが気になる人
ナンパしまくりたい人

とにかく今から人とコミュニケーションをとる必要性がある人

### 製品説明（具体的な製品の説明）
大きく分けて3つの機能を備えている．
・においチェッカー
・遠隔アドバイザー
・周囲の人とつながれる機能

### 特長
#### 1. においチェッカー
コミュニケーションが苦手な人は身だしなみになど気にも留めないでしょう
おそらくどんなにおいが人に気に入られるかなど知りもしないはず
しかし，人は第一印象をにおいで判断するとも言われています．
(http://www.sankei.com/life/news/150610/lif1506100026-n1.html)
そこで，そんなあなたのためににおいを判断してくれるツールを用意しました．

#### 2. 遠隔アドバイザー
コミュニケーションが苦手な人にとって誰かと会話をすることは苦痛で仕方がないでしょう．
しかし，円滑な会話はコミュニケーションの基本です．
そこで，遠隔地にいるコミュニケーションプロフェッショナル"DOI"からアドバイスを受けながら
現実世界でのコミュニケーションを行うことのできるツールを用意しました．

#### 3. 周囲の人とつながれる機能(Neighbor Me)
コミュニケーションが苦手な人にとって見知らぬ誰かとかかわることなど悪夢でしかありません．
しかし，人を知り己を知らば１００戦危うからず．相手を知れば”DOI”のアドバイスにより円滑なコミュニケーションが見込めます．
そこで，位置が近い人（同じ室内にいるなど）の趣味などの情報（今日課金して３万溶かした...， 今FIFA18をやってる！ etc. ）が分かる
ツールを用意しました．
https://www.navieclipse.com

### 解決出来ること
・第一段階
　誰かとつながれる！
 
・第二段階
　第一印象が良くなる！

・第三段階
　コミュニケーションの第一歩を踏み出しやすくなる！！

### 今後の展望
遠隔アドバイザーをAIを使って行う．
-コミュニケーションをとっている相手の表情，音声を認識して今どんな会話をすればよいかを実装する．
具体例：
相手が今笑顔ならば＝＞このまま話を続ける．
相手がふてくされていたら＝＞帰る．
などのアドバイスを自動で行う．


## 開発内容・開発技術
### 活用した技術

#### フレームワーク・ライブラリ・モジュール・API・データ
* Amazon Web Service (AWS)
* Sky Way (WebRTC)
* Face API (Microsoft recognition)
* Node.js
* Mongodb
* React.js
* GeoLocation(API)

#### デバイス
* Android (Nexus 5)
* Arduino uno
* においセンサー
* Bluetooth (FN-42 i/rm)

### 研究内容・事前開発プロダクト（任意） 


### 独自開発技術（Hack Dayで開発したもの）
#### 2日間に開発した独自の機能・技術
* 周囲の人とつながれる機能(Neighbor Me) => ドメイン取得, EC2インスタンス起動以外2日間でやりました．
* 遠隔アドバイザー => SkywayAPIkey取得以外
* においセンサー => Arduinoとにおいセンサーでにおい取得し，Bluetooth送信部分とAndroid受信部分，ＵＩ
基本的に全部2日間でやりました．
パソコン2つおしゃかにしました...
