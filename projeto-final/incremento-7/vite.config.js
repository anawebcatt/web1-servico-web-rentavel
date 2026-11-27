import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Endereço em que o site está publicado. É o único lugar em que ele aparece:
// o index.html, o robots.txt e o sitemap.xml são preenchidos a partir daqui.
// Se o endereço mudar (outro nome na Cloudflare ou um domínio próprio), basta trocar esta linha.
const URL_DO_SITE = 'https://combinacor.pages.dev';

// As páginas com conteúdo para os buscadores. As favoritas (que são de cada pessoa),
// o link de paleta e a página não encontrada ficam de fora.
const PAGINAS = ['/', '/como-usar'];

// Pequeno plugin do Vite: troca %URL_DO_SITE% no index.html e cria o robots.txt
// e o sitemap.xml na hora do build.
function enderecoDoSite() {
  return {
    name: 'endereco-do-site',
    transformIndexHtml(html) {
      return html.replaceAll('%URL_DO_SITE%', URL_DO_SITE);
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${URL_DO_SITE}/sitemap.xml\n`,
      });
      const enderecos = PAGINAS.map((pagina) => `  <url><loc>${URL_DO_SITE}${pagina}</loc></url>`);
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...enderecos,
          '</urlset>',
          '',
        ].join('\n'),
      });
    },
  };
}

// O site fica na raiz do domínio, então os caminhos do build começam com "/" (o padrão do Vite).
// Isso é necessário para as rotas sem "#": em /paleta/triade/0047AB, um caminho relativo
// procuraria os arquivos dentro de /paleta/triade/.
export default defineConfig({
  plugins: [react(), enderecoDoSite()],
  test: {
    include: ['src/**/*.test.js'],
  },
});
