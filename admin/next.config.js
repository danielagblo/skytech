/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			// Proxy the public Vite site under /site (single-port access via 3000)
			{ source: '/site/@vite/:path*', destination: 'http://localhost:5173/@vite/:path*' },
			{ source: '/site/node_modules/:path*', destination: 'http://localhost:5173/node_modules/:path*' },
			{ source: '/site/src/:path*', destination: 'http://localhost:5173/src/:path*' },
			{ source: '/site/:path*', destination: 'http://localhost:5173/:path*' },
		];
	},
};

module.exports = nextConfig
