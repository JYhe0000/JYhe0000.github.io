// 项目站点部署在子路径(/jianyuanhe.github.io/)下：
// 1. 文章内容中的站点绝对路径(/img/... 等)需要经过 url_for 加上 root 前缀
// 2. 主题部分 helper 拼接 config.url 时未带 root，渲染后统一补齐
const SITE_ROOT = '/jianyuanhe.github.io';
const SITE_ORIGIN = 'https://jyhe0000.github.io';

hexo.extend.filter.register('after_post_render', (data) => {
  const urlFor = hexo.extend.helper.get('url_for').bind(hexo);
  data.content = data.content.replace(
    /(<(?:img|a|source|video|audio|image)[^>]*?\s(?:src|href|xlink:href))="(\/[^"]*)"/g,
    (m, attr, path) => `${attr}="${urlFor(path)}"`
  );
  return data;
}, 1);

hexo.extend.filter.register('after_render:html', (str) => {
  let out = str.replace(
    new RegExp(`(${SITE_ORIGIN})/(?!jianyuanhe\\.github\\.io)`, 'g'),
    `$1${SITE_ROOT}/`
  );
  // 主题封面图等未经 url_for 的站点绝对路径（已带 root 的不会命中）
  out = out
    .replace(/((?:src|href)=")\/((?:img|assets)\/)/g, `$1${SITE_ROOT}/$2`)
    .replace(/(url\((?:&quot;|")?)\/((?:img|assets)\/)/g, `$1${SITE_ROOT}/$2`);
  return out;
}, 1);
