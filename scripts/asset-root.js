// 路径前缀自适应：从 hexo 配置动态读取 url/root，不修改任何主题文件。
// - root 非根路径时（项目站点子目录部署）：给内容/封面中未经 url_for 的站点绝对路径补前缀
// - root 为 "/" 时（用户站点根路径部署）：无需处理，全部跳过
const siteRoot = () => (hexo.config.root || '/').replace(/\/$/, '');

hexo.extend.filter.register('after_post_render', (data) => {
  const root = siteRoot();
  if (root === '') return data; // 根路径部署，无需补前缀
  data.content = data.content.replace(
    /(<(?:img|a|source|video|audio|image)[^>]*?\s(?:src|href|xlink:href))="(\/[^"]*)"/g,
    (m, attr, path) => `${attr}="${root}${path}"`
  );
  return data;
}, 1);

hexo.extend.filter.register('after_render:html', (str) => {
  const root = siteRoot();
  if (root === '') return str;
  // 主题 helper 拼接 config.url 时未带 root 的 URL（canonical/og:url/封面等）统一补齐
  const origin = (hexo.config.url || '').replace(/\/$/, '');
  if (!origin) return str;
  const escaped = origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rootEscaped = root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return str
    .replace(new RegExp(`(${escaped})/(?!${rootEscaped.slice(1)})`, 'g'), `$1${root}/`)
    .replace(/((?:src|href)=")\/((?:img|assets)\b)/g, `$1${root}/$2`)
    .replace(/(url\((?:&quot;|")?)\/((?:img|assets)\b)/g, `$1${root}/$2`);
}, 1);
