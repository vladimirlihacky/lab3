import Bun from "bun"

await Bun.build({
    entrypoints: ["./src/server/main.ts"],
    outdir: "./dist/server",
    tsconfig: "./tsconfig.json",
    target: "node"
})