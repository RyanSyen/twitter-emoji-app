import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Twitter Emoji App NextJS Project with T3 Stack",
    short_name: "Twitter Emoji App",
    description:
      "A step by step tutorial building a Twitter Emoji App using T3 stack by Theo",
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
