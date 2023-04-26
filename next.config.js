/**
* @type {import('next').NextConfig}
*/
const nextConfig = {
    headers: (
        process.env.NODE_ENV === 'development'
        ? () => [
            {
                source: '/_next/static/css/_app-client_src_app_globals_css.css',
                headers: [{ key: 'Vary', value: '*' }],
            },
            ]
        : undefined
    ),
    output: "export"
}

module.exports = nextConfig