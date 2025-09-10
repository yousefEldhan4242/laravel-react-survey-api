/** @type {import('tailwindcss').Config} */
export default {
    content: ['index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            keyframes: {
                'fade-in-down': {
                    from: {
                        transform: 'translateY(-0.75rem)',
                        opacity: '0',
                    },
                    to: {
                        transform: 'translateY(0rem)',
                        opacity: '1',
                    },
                },
            },
            animation: {
                'fade-in-down': 'fade-in-down 0.2s ease-in-out both',
            },
            animationDelay: {
                "100": '0.1s',
                "200": '0.2s',
                "300": '0.3s',
                "400": '0.4s',
                "500": '0.5s',
            },
        },
    },
    plugins: [
    ],
};
