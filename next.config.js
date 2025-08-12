/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 빌드 시 TypeScript 에러가 있어도 빌드를 계속하도록 설정 (선택사항)
    ignoreBuildErrors: false,
  },
  eslint: {
    // 빌드 시 ESLint 에러가 있어도 빌드를 계속하도록 설정 (선택사항)
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig