#!/bin/bash
# Stage the Astro SSR build as a Cloudflare Pages _worker.js deployment.
# The @astrojs/cloudflare 14 adapter targets Workers (ASSETS binding), which
# Pages rejects in wrangler config -- but Pages accepts the same Worker code
# as a `_worker.js` file at the root of the deploy directory, with Pages
# injecting the ASSETS binding automatically.
# RELATIVE-PATH version for the git-connected Pages build (runs on the Pages
# build machine, where the PoC's absolute /home/hatch paths do not exist).
set -e
cd "$(dirname "$0")/.."
SRC=dist
STAGE=pages-dist
rm -rf "$STAGE"
mkdir -p "$STAGE"
# 1. Static files at the deploy root (client output becomes the site root)
cp -r "$SRC/client/." "$STAGE/"
# 2. The Worker entry as _worker.js + its chunks + middleware module
cp "$SRC/server/entry.mjs" "$STAGE/_worker.js"
[ -d "$SRC/server/chunks" ] && cp -r "$SRC/server/chunks" "$STAGE/chunks"
[ -f "$SRC/server/virtual_astro_middleware.mjs" ] && cp "$SRC/server/virtual_astro_middleware.mjs" "$STAGE/virtual_astro_middleware.mjs"
echo "staged:"
find "$STAGE" -type f | wc -l
ls "$STAGE" | head -20
