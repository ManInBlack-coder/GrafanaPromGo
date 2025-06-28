# Prometheus Server

See kaust on mõeldud Prometheuse serveri binaarfailide hoidmiseks. Prometheuse käivitatavaid faile ja selle andmeid **ei laeta Giti repositooriumisse**, kuna need on suured ja dünaamilised.

## Seadistamine (kui kloonite repositooriumi)

Prometheuse serveri käivitamiseks oma kohalikus arenduskeskkonnas toimige järgmiselt:

1.  **Liigu Prometheuse serveri kausta:**
    ```bash
    cd prometheus-server
    ```

2.  **Laadi alla Prometheus (Apple Silicon / ARM64 versioon):**
    * Mine Prometheuse ametlikule allalaadimislehele: [https://prometheus.io/download/](https://prometheus.io/download/)
    * Leia uusim **stabiilne versioon** (nt `v2.45.0`).
    * Otsi üles `darwin-arm64` (.tar.gz) link ja kopeeri see.
    * Terminalis laadi alla:
        ```bash
        curl -LO [https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.darwin-arm64.tar.gz](https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.darwin-arm64.tar.gz)
        # Asenda versiooninumber uusimaga
        ```

3.  **Paki Prometheus lahti:**
    ```bash
    tar -xvf prometheus-2.45.0.darwin-arm64.tar.gz
    # Asenda failinimi õigega
    ```
    See loob kausta nimega `prometheus-2.45.0.darwin-arm64` (või sarnase) siia kausta.

4.  **Kustuta allalaaditud arhiivifail:**
    ```bash
    rm prometheus-2.45.0.darwin-arm64.tar.gz
    ```

## Prometheuse käivitamine

Pärast allalaadimist ja lahtipakkimist saad Prometheuse käivitada:

1.  **Liigu lahtipakitud Prometheuse kausta:**
    ```bash
    cd prometheus-2.45.0.darwin-arm64
    # Asenda versiooninumber õigega
    ```

2.  **Käivita Prometheus:**
    ```bash
    ./prometheus
    ```
    Prometheus käivitub vaikimisi pordil `9090`.

3.  **Ava Prometheuse veebiliides:**
    Navigeeri oma veebibrauseris aadressile: `http://localhost:9090`

## Konfiguratsioon

Prometheuse konfiguratsioonifail asub lahtipakitud kaustas (`prometheus-2.45.0.darwin-arm64/prometheus.yml`). Saate seda muuta vastavalt oma vajadustele, näiteks sihtmärkide (targets) lisamiseks.

---

### Kuidas see fail luua ja lisada Giti:

1.  **Liigu õigesse kausta:**
    ```bash
    cd /Users/sass/Documents/GitHub/GrafanaPromGo/prometheus-server/
    ```

2.  **Loo `README.md` fail:**
    ```bash
    touch README.md
    ```

3.  **Ava fail ja kopeeri ülalolev sisu sinna:**
    ```bash
    open -e README.md # Avab TextEditiga
    # või code README.md # Kui kasutad VS Code'i
    ```
    Kopeeri kogu ülaltoodud markdown tekst ja salvesta fail.

4.  **Lisa ja commiti `README.md` fail Giti:**
    ```bash
    cd /Users/sass/Documents/GitHub/GrafanaPromGo/
    git add prometheus-server/README.md
    git commit -m "Add README for Prometheus server setup"
    git push origin main
    ```

Nüüd on sinu repositooriumis olemas selged juhised Prometheuse seadistamiseks, ilma et peaksid suuri binaarfaile Giti laadima!