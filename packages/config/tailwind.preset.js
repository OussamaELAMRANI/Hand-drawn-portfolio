/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Paper / surfaces (light)
                paper: {
                    DEFAULT: '#FDFDFD',   // page
                    50:  '#ffffff',
                    100: '#fbfbf5',
                    200: '#f7f7f1',
                    300: '#f2f2ea',
                    400: '#efefe8',
                    500: '#eef0ea',
                },
                // Ink / text + strokes (light)
                ink: {
                    DEFAULT: '#2A2A2A',   // primary text / sketch stroke
                    600: '#3a3a3a',
                    500: '#6a6a60',
                    400: '#8a8a80',
                    300: '#a5a59a',
                    200: '#cfcfc7',       // hairline / border
                    100: '#e3e3da',
                },
                // Dark-mode surfaces
                night: {
                    DEFAULT: '#15171c',   // page
                    800: '#20232a',
                    700: '#262931',
                    600: '#2c2f37',
                    500: '#3a3d45',
                },
                // Dark-mode ink
                chalk: {
                    DEFAULT: '#e9e9e1',
                    600: '#cbcbc3',
                    500: '#a2a29a',
                    400: '#7e7e76',
                },
                // Accents (kept identical in both modes)
                marker: '#FCE34B',      // highlighter yellow
                sky:    '#6FD3E0',      // tape · secondary fill
                blush:  '#fff7fa',      // pink paper tint
                blushInk: '#e8cdd6',
                cyan:    '#0E93A8',     // links · accents
                magenta: '#C0577F',     // CTA · destructive · AI
                violet:  '#8A6BCF',     // category · News
                amber:   '#C98A2B',     // category · Career
                terminal: '#22252B',    // code surface
                // Dark-mode tints of blush (callout card)
                nightBlush: '#2a2130',
                nightBlushInk: '#4a3540',
            },
            boxShadow: {
                sticky:   '5px 7px 0 rgba(42,42,42,0.10)',
                lifted:   '7px 9px 0 rgba(42,42,42,0.12)',
                terminal: '8px 10px 0 rgba(42,42,42,0.14)',
            },
            fontFamily: {
                display: ['Caveat', 'cursive'],
                hand:    ['Patrick Hand', 'cursive'],
                sans:    ['Nunito Sans', 'system-ui', 'sans-serif'],
                mono:    ['JetBrains Mono', 'monospace'],
            },
            fontSize: {
                h1:    ['56px', { lineHeight: '1',   fontWeight: '700' }],
                h2:    ['40px', { lineHeight: '1',   fontWeight: '700' }],
                lead:  ['30px', { lineHeight: '1.1' }],
                label: ['19px', { lineHeight: '1.3' }],
                body:  ['17px', { lineHeight: '1.55' }],
                mono:  ['14px', { lineHeight: '1.5' }],
            },
        },
    },
    plugins: [],
}