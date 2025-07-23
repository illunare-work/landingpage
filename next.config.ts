/** @type {import('next').NextConfig} */
const nextConfig = {
	// For local development, basePath is '/'
	// This file will be overwritten during deployment with the appropriate basePath
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				port: '',
				pathname: '/**',
			},
		],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	// Optimize build performance
	experimental: {
		optimizePackageImports: [
			'lucide-react',
			'framer-motion',
			'@radix-ui/react-accordion',
			'@radix-ui/react-tooltip',
		],
	},
	// Prevent issues with build manifest
	typescript: {
		ignoreBuildErrors: false,
	},
	eslint: {
		ignoreDuringBuilds: false,
	},
	// Optimize dev server
	devIndicators: {
		position: 'bottom-right',
	},
	// Reduce console noise and security
	logging: {
		fetches: {
			fullUrl: false,
		},
	},
	// Hide errors in production and suppress console warnings
	productionBrowserSourceMaps: false,
	
	// Compiler optimizations
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production' ? {
			exclude: ['error']
		} : false,
	},
	
	// Turbopack configuration for development
	turbopack: {
		// Module resolution extensions
		resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
		
		// Resolve aliases (matching tsconfig paths)
		resolveAlias: {
			'@': '.',
			'@/components': './components',
			'@/lib': './lib',
			'@/hooks': './hooks',
			'@/config': './config',
			'@/styles': './styles',
		},
		
		// Rules for CSS processing
		rules: {
			'*.css': {
				loaders: [],
				as: '*.css',
			},
		},
	},
	
	// Webpack optimizations (for production builds)
	webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
		// Only apply webpack optimizations for production builds
		if (!dev && !isServer) {
			// Suppress CSS parsing warnings in production
			config.stats = {
				...config.stats,
				warnings: false,
				errors: false,
				warningsFilter: [
					/Failed to parse.*opacity/,
					/Failed to parse.*background/,
					/Failed to parse.*webkit-text-size-adjust/,
					/Ignored rule due to incorrect selector/,
					/Unknown pseudo-class or pseudo-element/,
				],
			};
			
			// Optimize for production
			config.optimization = {
				...config.optimization,
				minimize: true,
				usedExports: true,
				sideEffects: false,
			};
			
			// Reduce bundle size
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
			};
		}
		
		// Suppress specific CSS warnings in development too
		if (dev) {
			config.stats = {
				...config.stats,
				warningsFilter: [
					/Failed to parse.*opacity/,
					/Failed to parse.*background/,
					/Failed to parse.*webkit-text-size-adjust/,
					/Ignored rule due to incorrect selector/,
					/Unknown pseudo-class or pseudo-element/,
					/unreachable code after return statement/,
				],
			};
		}
		
		return config;
	},
	
	// Headers for security
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()',
					},
					{
						key: 'Content-Security-Policy',
						value: "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
					},
				],
			},
		];
	},
};

export default nextConfig;
