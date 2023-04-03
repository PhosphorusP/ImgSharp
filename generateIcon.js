import { readFileSync } from "fs";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { basename } from "path";
import { resources } from "./configs";
const pluginGenerate = (pluginConfig) => ({
  async generateBundle() {
    let source = readFileSync(pluginConfig.source);
    if (pluginConfig.bundleSource);
    this.emitFile({
      fileName: "assets/" + basename(pluginConfig.source),
      type: "asset",
      source: source,
    });
    for (let r of resources) {
      let ext = r[1].split(".").at(-1);
      switch (ext) {
        case "png":
          this.emitFile({
            fileName: "assets/" + r[1],
            type: "asset",
            source: await sharp(source).resize(r[0], r[0])[ext]().toBuffer(),
          });
          break;
        case "ico":
          this.emitFile({
            fileName: r[1],
            type: "asset",
            source: await pngToIco([
              await sharp(source)
                .resize(r[0], r[0])
                .png({ options: { compressionLevel: 9 } })
                .toBuffer(),
            ]),
          });
      }
    }
  },
});
export { resources, pluginGenerate };
