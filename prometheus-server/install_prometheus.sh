#!/bin/bash
# Prometheus install script for linux-amd64
# Laadib alla ja pakib lahti viimase Prometheuse versiooni (muuda VERSION soovi korral)

set -e

VERSION="2.45.0"
PLATFORM="linux-amd64"
FILENAME="prometheus-$VERSION.$PLATFORM.tar.gz"
DOWNLOAD_URL="https://github.com/prometheus/prometheus/releases/download/v$VERSION/$FILENAME"

# Lae alla
curl -LO "$DOWNLOAD_URL"

# Paki lahti

tar -xvf "$FILENAME"

# Kustuta arhiiv
rm "$FILENAME"

echo "Prometheus $VERSION on lahti pakitud. Kaust: prometheus-$VERSION.$PLATFORM"
