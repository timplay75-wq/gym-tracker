// GitHub Pages не умеет переписывать пути на index.html: файла /profile
// на диске нет, поэтому прямой заход или F5 отдают 404.
//
// Приём стандартный — положить рядом 404.html с тем же содержимым. Pages
// отдаст его на любой неизвестный путь, адрес в строке браузера сохранится,
// и react-router разберёт маршрут уже на клиенте.
//
// На Cloudflare Pages и Netlify ту же роль играет public/_redirects.
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const index = join(dist, 'index.html');

if (!existsSync(index)) {
  console.error('spa-fallback: dist/index.html не найден — сборка не выполнена?');
  process.exit(1);
}

copyFileSync(index, join(dist, '404.html'));
console.log('spa-fallback: dist/404.html создан');
