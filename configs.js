export const resources = [
  // [size, name, inManifest]
  [192, "pwa-192.png"],
  [512, "pwa-512.png"],
  [48, "favicon.png"],
  [180, "apple-touch-icon.png"],
];
export const manifest = {
  name: "ImgSharp#",
  short_name: "ImgSharp",
  description: "A tool to process images.",
  display: "standalone",
  theme_color: "#FFFFFF",
  background_color: "#888888",
  icons: [
    {
      src: "./assets/pwa-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "./assets/pwa-512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "./assets/pwa-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
  file_handlers: [
    {
      action: "./",
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
      },
      icons: [
        { src: "./assets/pwa-192.png", sizes: "192x192", type: "image/png" },
      ],
    },
  ],
  share_target: {
    action: "./share",
    method: "POST",
    enctype: "multipart/form-data",
    params: {
      title: "图片",
      text: "",
      files: [
        {
          name: "images",
          accept: ["image/png", ".png", "image/jpeg", ".jpg", ".jpeg"],
        },
      ],
    },
  },
};
