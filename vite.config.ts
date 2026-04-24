import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';
import archiver from 'archiver';

const serveSourceZipPlugin = (): Plugin => ({
  name: 'serve-source-zip',
  configureServer(server) {
    server.middlewares.use('/download-github-ready.zip', (req, res) => {
      try {
        console.log('Zipping source code...');
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=github-ready-source.zip');
        
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);
        
        archive.append(`لرفع التطبيق على جيت هاب:

1. قم برفع كافة هذه الملفات لمستودعك (Repository) في فرع main.
2. اذهب لإعدادات المستودع -> Pages.
3. غير الـ Source إلى "GitHub Actions".
4. انتظر قليلاً وسيقوم جيت هاب بتهيئة موقعك بنجاح.
`, { name: 'تعليمات_الرفع.txt' });

        archive.glob('**/*', {
          cwd: __dirname,
          ignore: ['node_modules/**', 'dist/**', '.git/**', '*.zip']
        });
        
        archive.finalize();
      } catch (err) {
        res.statusCode = 500;
        res.end(String(err));
      }
    });
  }
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss(), serveSourceZipPlugin()],
    build: {
      assetsDir: '', // Flatten all output to root of dist/ (no folders!)
      rollupOptions: {
        output: {
          entryFileNames: `app.js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`
        }
      }
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
