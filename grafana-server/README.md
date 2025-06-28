# Grafana Server

See kaust on mõeldud Grafana serveri binaarfailide ja andmete hoidmiseks. Grafana serveri installatsioon ja sellega seotud andmed (andmebaas, logid) **ei laeta Giti repositooriumisse**, kuna need on suured ja sisaldavad dünaamilist ning lokaalset infot.

## Seadistamine (kui kloonite repositooriumi)

Grafana serveri käivitamiseks oma kohalikus arenduskeskkonnas toimige järgmiselt:

1.  **Liigu Grafana serveri kausta:**
    ```bash
    cd grafana-server
    ```

2.  **Laadi alla Grafana (Apple Silicon / ARM64 versioon):**
    * Mine Grafana ametlikule allalaadimislehele: [https://grafana.com/grafana/download](https://grafana.com/grafana/download)
    * Vali:
        * **Edition:** Open Source
        * **Operating System:** macOS
        * **Architecture:** ARM64
        * **Package Type:** Binary (.tar.gz)
    * Kopeeri pakutud allalaadimise URL (nt `https://dl.grafana.com/oss/release/grafana-10.4.5.darwin-arm64.tar.gz`).
    * Terminalis laadi alla (asenda URL ja versiooninumber uusimaga):
        ```bash
        curl -LO [https://dl.grafana.com/oss/release/grafana-10.4.5.darwin-arm64.tar.gz](https://dl.grafana.com/oss/release/grafana-10.4.5.darwin-arm64.tar.gz)
        ```

3.  **Paki Grafana lahti:**
    ```bash
    tar -xvf grafana-10.4.5.darwin-arm64.tar.gz
    # Asenda failinimi õigega. See loob kausta nagu 'grafana-10.4.5' siia kausta.
    ```

4.  **Kustuta allalaaditud arhiivifail:**
    ```bash
    rm grafana-10.4.5.darwin-arm64.tar.gz
    ```

## Grafana käivitamine

Pärast allalaadimist ja lahtipakkimist saad Grafana käivitada:

1.  **Liigu lahtipakitud Grafana kausta:**
    ```bash
    # Eeldades, et lahtipakitud kausta nimi on 'grafana-10.4.5'
    cd grafana-10.4.5
    # Asenda 'grafana-10.4.5' õige kausta nimega, kui see peaks erinema.
    ```

2.  **Käivita Grafana server:**
    ```bash
    ./bin/grafana-server
    ```
    Grafana käivitub vaikimisi pordil `3000`.

3.  **Ava Grafana veebiliides:**
    Navigeeri oma veebibrauseris aadressile: `http://localhost:3000`
    Vaikimisi sisselogimise andmed on `admin` / `admin`. Sul palutakse esimesel sisselogimisel parool vahetada.

## Konfiguratsioon

Grafana konfiguratsioonifailid asuvad lahtipakitud kaustas `conf/` alamkataloogis (nt `grafana-10.4.5/conf/defaults.ini` ja `grafana.ini`).
**Oluline:** Väldi otseseid muudatusi paigalduskausta konfiguratsioonifailidesse, kuna need kaovad Grafana uuendamisel. Parem on kasutada keskkonnamuutujaid või oma `custom.ini` faili.
