/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Action mặc định chỉ nhận 1MB nên tải ảnh bìa lên sẽ bị lỗi; Vercel giới hạn cứng khoảng 4,5MB
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  images: { remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }] },
};
export default nextConfig;
