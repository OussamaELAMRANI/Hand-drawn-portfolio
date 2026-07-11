import preset from '@larevo/config/tailwind'

// loaded via @config in src/styles/main.css
export default {
    presets: [preset],
    content: ['../../packages/config/**/*.js', './stories/**/*'],
}
