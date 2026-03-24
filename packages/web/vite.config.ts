import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function resolveBasePath(): string {
  if (!process.env['GITHUB_ACTIONS']) {
    return '/';
  }

  const repository = process.env['GITHUB_REPOSITORY'];
  if (!repository) {
    return '/';
  }

  const repoName = repository.split('/')[1];
  return repoName ? `/${repoName}/` : '/';
}

export default defineConfig({
  plugins: [react()],
  base: resolveBasePath(),
});
