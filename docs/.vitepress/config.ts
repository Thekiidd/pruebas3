import { defineConfig } from 'vitepress';

export default defineConfig({
  title: "OpenDev Agent Platform",
  description: "AI coding agent platform — open source alternative to Claude Code.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Architecture', link: '/architecture' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Architecture', link: '/architecture' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/opendev/opendev' }
    ]
  }
});
