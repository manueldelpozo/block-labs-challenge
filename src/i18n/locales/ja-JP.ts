import type { TTranslationMap } from '@/config/i18n.config';

export const jaJP: TTranslationMap = {
  'nav.dashboard': 'ダッシュボード',
  'nav.profile': 'プロフィール',
  'nav.settings': '設定',

  'page.dashboard.title': 'ダッシュボード',
  'page.dashboard.description':
    'マルチテナントプラットフォームのリアルタイムパフォーマンスメトリクスとビジネス概要。',
  'page.dashboard.betaBanner.title': 'ベータ機能プレビュー有効',
  'page.dashboard.betaBanner.message':
    '現在ベータ版のインターフェースレイアウトをプレビューしています。一部の高度なレポートは開発中です。',
  'page.dashboard.errorLoading': 'メトリクスの読み込みエラー',
  'page.dashboard.errorLoading.message':
    'ダッシュボードのパフォーマンスデータを読み込めませんでした：',
  'page.dashboard.analytics.title': '高度な運用分析',
  'page.dashboard.analytics.enabled':
    'テナントで運用分析の可視化が有効になっています。以下はモック配布グラフです。',
  'page.dashboard.analytics.disabled':
    '⚠️ テナントでは高度な運用分析が無効になっています。サポートにお問い合わせいただくか、サブスクリプションをアップグレードしてチャートを有効にしてください。',
  'page.dashboard.trendVsLastPeriod': '前期比',
  'page.dashboard.stat.totalRevenue': '総収益',
  'page.dashboard.stat.activeUsers': 'アクティブユーザー',
  'page.dashboard.stat.conversionRate': 'コンバージョン率',
  'page.dashboard.stat.avgResponseTime': '平均応答時間',

  'page.profile.title': 'ユーザープロフィール',
  'page.profile.description': '外観設定と個人情報を管理します。',
  'page.profile.appearance': '外観',
  'page.profile.colorScheme': 'カラースキーム',
  'page.profile.colorSchemeDescription':
    '好みのカラースキームを選択してください。自動はシステム設定に従います。',
  'page.profile.profileInfo': 'プロフィール情報',
  'page.profile.fullName': '氏名',
  'page.profile.fullNameDescription': 'プラットフォーム全体で表示される名前',
  'page.profile.fullNamePlaceholder': '氏名を入力',
  'page.profile.email': 'メールアドレス',
  'page.profile.emailDescription': '通知とアカウント復旧に使用されます',
  'page.profile.emailPlaceholder': 'メールアドレスを入力',
  'page.profile.bio': '自己紹介',
  'page.profile.bioDescription': '自分についての簡単な説明（最大200文字）',
  'page.profile.bioPlaceholder': '自分について教えてください',
  'page.profile.saveChanges': '変更を保存',

  'page.settings.title': '設定',
  'page.settings.description':
    'テナント環境変数、有効な機能、構成プロファイルを表示およびカスタマイズします。',
  'page.settings.tenantSpecs': 'テナント仕様',
  'page.settings.activeFeatures': '有効な機能',
  'page.settings.simulator': 'インタラクティブ設定シミュレーター',
  'page.settings.officialName': '正式名称',
  'page.settings.resolvedId': '解決済みID',
  'page.settings.apiEndpoint': 'APIエンドポイント',
  'page.settings.themeFont': 'テーマフォント',
  'page.settings.borderRadius': 'ボーダー半径',
  'page.settings.analyticsSuite': '分析スイート',
  'page.settings.settingsConsole': '設定コンソール',
  'page.settings.darkMode': 'ダークモード',
  'page.settings.betaBanner': 'ベータバナーアラート',
  'page.settings.active': '有効',
  'page.settings.suspended': '停止中',
  'page.settings.adminHandle': '管理ハンドル',
  'page.settings.adminHandleDescription': 'このセッションのローカル管理者名を変更',
  'page.settings.adminHandlePlaceholder': '管理ハンドルを入力',
  'page.settings.emailDispatch': '自動メール配信を有効にする',
  'page.settings.emailDispatchDescription':
    '設定オーバーライドのメールアラートトグル状態をシミュレート',
  'page.settings.applyOverrides': 'オーバーライドを適用',

  'page.notFound.title': 'ページが見つかりません',
  'page.notFound.description':
    'リンクが壊れているか、テナントサブスクリプションでページが移動または無効になった可能性があります。',
  'page.notFound.returnHome': 'ダッシュボードに戻る',

  'page.profile.validation.nameTooShort': '名前は2文字以上である必要があります',
  'page.profile.validation.invalidEmail': '有効なメールアドレスを入力してください',
  'page.profile.validation.bioTooLong': '自己紹介は200文字以内である必要があります',

  'page.settings.validation.handleTooShort': '管理ハンドルは3文字以上である必要があります',

  'common.trend.increase': '増加',
  'common.trend.decrease': '減少',
};
