#!/bin/bash
# Grafana install script for macOS ARM64 (Apple Silicon)
# Laadib alla ja pakib lahti viimase Grafana versiooni (muuda VERSION ja PLATFORM soovi korral)

set -e

VERSION="10.4.5"
PLATFORM="darwin-arm64"
FILENAME="grafana-$VERSION.$PLATFORM.tar.gz"
DOWNLOAD_URL="https://dl.grafana.com/oss/release/$FILENAME"

# Lae alla
curl -LO "$DOWNLOAD_URL"

# Paki lahti

tar -xvf "$FILENAME"

# Kustuta arhiiv
rm "$FILENAME"

echo "Grafana $VERSION on lahti pakitud. Kaust: grafana-$VERSION"
