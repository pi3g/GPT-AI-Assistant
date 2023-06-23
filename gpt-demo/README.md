# OpenAI Chat with Streaming Demo

## About

This project is a minimal Demo to showcase OpenAI's chat API, with streaming answers. The demo uses the following Open Source frameworks/libraries:
- [Nuxt](https://nuxt.com/) Framework
- [Vuetify](https://vuetifyjs.com/) UI Components
- [MDI Font](https://www.npmjs.com/package/@mdi/font) icons
- [Vue-Showdown](https://www.npmjs.com/package/vue-showdown) for formatting Markdown to HTML
- [OpenAI-streams](https://www.npmjs.com/package/openai-streams) for easy use of streamed responses from OpenAI's API

## Getting Started

### Prerequisites
- Node.js version 18.16.0 or greater
- npm and yarn (yarn can be installed using `npm install -g yarn`)
- OpenAI API Key

### Configuration
- Put the API Key in the `nuxt.config.ts` file, at line 4
- To switch between GPT3.5 and GPT 4 change the `model` in `nuxt.config.ts` to either `"gpt-3.5-turbo"` or `"gpt-4"`

### Building and Running the web app
Make sure to install the dependencies:
```bash
yarn install
```

Build the application for production:
```bash
yarn build
```

Run a preview of the build:
```bash
yarn preview
```

The Website can now be accessed at `http://localhost:3000`

## Development Server
Start a development server with live-refresh and Nuxt Devtools
```bash
yarn dev
```