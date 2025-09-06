import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				surface: 'hsl(var(--surface))',
				'surface-variant': 'hsl(var(--surface-variant))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))',
					variant: 'hsl(var(--primary-variant))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				'ai-accent': {
					DEFAULT: 'hsl(var(--ai-accent))',
					glow: 'hsl(var(--ai-accent-glow))'
				},
				'ai-response': 'hsl(var(--ai-response))',
				success: {
					DEFAULT: 'hsl(var(--success))',
					glow: 'hsl(var(--success-glow))'
				},
				warning: 'hsl(var(--warning))',
				error: 'hsl(var(--error))',
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				editor: {
					bg: 'hsl(var(--editor-bg))',
					gutter: 'hsl(var(--editor-gutter))',
					selection: 'hsl(var(--editor-selection))',
					'line-highlight': 'hsl(var(--editor-line-highlight))'
				},
				syntax: {
					keyword: 'hsl(var(--syntax-keyword))',
					string: 'hsl(var(--syntax-string))',
					number: 'hsl(var(--syntax-number))',
					comment: 'hsl(var(--syntax-comment))',
					function: 'hsl(var(--syntax-function))',
					variable: 'hsl(var(--syntax-variable))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-ai': 'var(--gradient-ai)',
				'gradient-surface': 'var(--gradient-surface)',
				'gradient-glow': 'var(--gradient-glow)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'ai-glow': 'var(--shadow-ai-glow)',
				'elegant': 'var(--shadow-elegant)'
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
