module.exports = {
  async rewrites() {
    const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${API}/api/:path*`, // proxy /api/* to backend
      },
    ];
  },
  images: {
    domains: ['api.builder.io'],
  },
};