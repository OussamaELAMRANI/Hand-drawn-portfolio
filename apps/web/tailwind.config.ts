import preset from '@larevo/config/tailwind'

// loaded via @config in app/assets/css/main.css (Tailwind v4);
// content detection is automatic in v4
export default {
    presets: [preset],
    content: ['./**/*.vue', '../../packages/config/**/*.js'],
}
