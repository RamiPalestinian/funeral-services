// client/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thumbs.dreamstime.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ritualservis.su",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin29.solinepro.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kzn-ritual.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "catering-muscat.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pamiatnikiizgranita.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "1-gc.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "haron64.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "spb.ritual.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "minskritual.by",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.magnific.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pohoroni21.ru",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;