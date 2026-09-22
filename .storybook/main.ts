// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'; // or @storybook/vue-vite, etc.
import { mergeConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            plugins: [tailwindcss()],
        });
    },
};
export default config;
