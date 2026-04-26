/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      keyframes: {
        slideUp: { from: { transform: 'translateY(10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: { slideUp: 'slideUp 0.18s ease' },
      colors: {
        bg:          '#F7F6F3',
        surface:     '#FFFFFF',
        border:      '#E8E7E3',
        muted:       '#8A8A86',
        accent:      '#4A6741',
        'accent-lt': '#EBF0EA',
        warn:        '#C4704F',
        'warn-lt':   '#FAF0EB',
      },
    },
  },
  plugins: [],
}

