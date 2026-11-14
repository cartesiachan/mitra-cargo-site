#!/bin/bash
# Download all 12 photos into public/images (photos are not stored in git).
# Run from the repo root: bash scripts/download-photos.sh
set -e
# The images dir is NOT in git (no tracked files), so a fresh clone lacks it.
mkdir -p "$(dirname "$0")/../public/images"
cd "$(dirname "$0")/../public/images"
curl -sSL --fail -o "collage-container.jpg" "https://www.mitraperkasacargo.com/wp-content/uploads/ekspedisi-jakarta-murah.jpg" && echo "collage-container.jpg $(stat -c%s "collage-container.jpg") bytes"
curl -sSL --fail -o "collage-kalimantan.jpg" "https://www.mitraperkasacargo.com/wp-content/uploads/ekspedisi-jakarta-kalimantan.jpg" && echo "collage-kalimantan.jpg $(stat -c%s "collage-kalimantan.jpg") bytes"
curl -sSL --fail -o "collage-team.jpg" "https://www.mitraperkasacargo.com/wp-content/uploads/jasa-pengiriman-barang-antarpulau.jpg" && echo "collage-team.jpg $(stat -c%s "collage-team.jpg") bytes"
curl -sSL --fail -o "dvid-barge.jpg" "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Heavy_Cargo_Shipment_Demonstrates_Value_of_Nation%27s_Waterway_Delivery_System_DVIDS326506.jpg/1280px-Heavy_Cargo_Shipment_Demonstrates_Value_of_Nation%27s_Waterway_Delivery_System_DVIDS326506.jpg" && echo "dvid-barge.jpg $(stat -c%s "dvid-barge.jpg") bytes"
# Hero image is Sen's own banner (not a public URL): decode it from the base64 copy in the repo.
base64 -d "../../scripts/hero-koper.jpg.b64" > "hero-koper.jpg" && echo "hero-koper.jpg $(stat -c%s "hero-koper.jpg") bytes"
curl -sSL --fail -o "ketapang-ferry.jpg" "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Ketapang_Ferry_Port%2C_East_Java%2C_20220821_1054_9794.jpg/1280px-Ketapang_Ferry_Port%2C_East_Java%2C_20220821_1054_9794.jpg" && echo "ketapang-ferry.jpg $(stat -c%s "ketapang-ferry.jpg") bytes"
curl -sSL --fail -o "kota-jayapura.jpg" "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Kota_Jayapura%2C_Papua.jpg/1280px-Kota_Jayapura%2C_Papua.jpg" && echo "kota-jayapura.jpg $(stat -c%s "kota-jayapura.jpg") bytes"
curl -sSL --fail -o "motor-ferry.jpg" "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/MOTORCYCLES_-_SANKTA_MARIA_ferry_%2C_LU.jpg/1280px-MOTORCYCLES_-_SANKTA_MARIA_ferry_%2C_LU.jpg" && echo "motor-ferry.jpg $(stat -c%s "motor-ferry.jpg") bytes"
curl -sSL --fail -o "port-makassar.jpg" "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Soekarno%E2%80%94Hatta_Port%2C_Makassar.jpg/1280px-Soekarno%E2%80%94Hatta_Port%2C_Makassar.jpg" && echo "port-makassar.jpg $(stat -c%s "port-makassar.jpg") bytes"
curl -sSL --fail -o "reecom-whale.jpg" "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Container_ship_Reecon_Whale_on_Black_Sea_near_Constan%C8%9Ba_Romania.jpg/1280px-Container_ship_Reecon_Whale_on_Black_Sea_near_Constan%C8%9Ba_Romania.jpg" && echo "reecom-whale.jpg $(stat -c%s "reecom-whale.jpg") bytes"
curl -sSL --fail -o "rotterdam-stacks.jpg" "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Shipping_container_stacks_-_Port_of_Rotterdam_-_2014_-_2.jpg/1280px-Shipping_container_stacks_-_Port_of_Rotterdam_-_2014_-_2.jpg" && echo "rotterdam-stacks.jpg $(stat -c%s "rotterdam-stacks.jpg") bytes"
curl -sSL --fail -o "terminal-bremerhaven.jpg" "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Container-Terminal_Bremerhaven_01.jpg/1280px-Container-Terminal_Bremerhaven_01.jpg" && echo "terminal-bremerhaven.jpg $(stat -c%s "terminal-bremerhaven.jpg") bytes"
