
```
# TaxDodgers – Interledger 2025  
### Intelligent Offline Payment & Voice System for Raspberry Pi

---

## Overview

**TaxDodgers** is an experimental **IoT payment and interaction system** developed for the **Interledger Hackathon 2025**.  
It merges **voice interaction**, **offline authentication**, and **wearable NFC wristbands** into a secure, fully edge-ready platform powered by a **Raspberry Pi**.

The project demonstrates how **Open Payments (Interledger API)** can integrate with **offline edge hardware** through our lightweight runtime **Intelli**, designed for optimal performance without network connectivity.

---

## Project Structure

TaxDodgers-Interledger2025/
│
├── server/                   # Backend logic (Intelli offline layer + API bridge)
│   ├── client.js             # Creates authenticated Interledger client
│   ├── grant.js              # Grant generation logic for data access
│   ├── quote.js              # Quote creation and payment data retrieval
│   └── server.js             # Local/offline server interface
│
├── app.vanilla.js            # Raspberry Pi UI logic (recording, modals, interaction)
├── index.html                # Frontend entry point (HTML + font setup)
├── styles.css                # Theme and layout for 800×480 touch screen
├── preview.sh                # Local static server (Python3)
├── private.key               # Interledger private key (⚠️ never commit publicly)
├── .gitignore                # Ignoring private keys, build artifacts, DS_Store
├── .gitattributes            # Git config for text normalization
└── README.md                 # This documentation

```
```

````

---

## Raspberry Pi Interface

The **Raspberry Pi UI** is a standalone front-end designed to run **directly on the Pi** — no build tools or internet connection required.

### Features:
- **Touch interface** optimized for 800×480 px display  
- **Start / Pause / Stop recording** using simple tactile buttons  
- **Help and report modals** rendered dynamically  
- **Voice recording lock:** voice input only activates after wristband authentication  
- **Status indicators:**  
  - `Ready` → `Recording...` → `Paused` → `Uploading...` → `Sent`  

Run locally:
```bash
cd TaxDodgers-Interledger2025
python3 -m http.server 8001
````

Then open `http://localhost:8001` or the Pi’s IP on another device.

---

## 🎙️ Voice & Wristband Interaction

* Each **TaxDodgers wristband** contains an **NFC tag** that authenticates the user.
* **Voice capture is disabled** until a valid wristband is scanned.
* Once activated, the user can record short updates or responses directly through the Raspberry Pi microphone.
* The voice data is processed **locally** by Intelli (no cloud dependency).

> ⚠️ **Note:** External users cannot test this feature unless provided with a test wristband.
> During demos, we’ll supply a working wristband with a test identity that enables full functionality.

---

## Interledger Integration Flow

TaxDodgers uses the **Open Payments API** from the **Interledger network** for authenticated operations.

### Authentication Sequence

1. **Load the private key**

   ```js
   import fs from 'fs'
   const privateKey = fs.readFileSync('private.key', 'utf-8')
   ```

2. **Create an authenticated client**

   ```js
   import { createAuthenticatedClient } from '@interledger/open-payments'

   const client = await createAuthenticatedClient({
     walletAddress: 'https://ilp.interledger-test.dev/mvr6',
     privateKey,
     keyId: 'your-key-id-here',
   })
   ```

3. **Request a grant**

   ```js
   const grant = await client.grant.request(
     { url: 'https://auth.interledger-test.dev/' },
     {
       access_token: {
         access: [{ type: 'incoming-payment', actions: ['create'] }],
       },
     }
   )
   ```

4. **Fetch or send data**

   * Once the grant is active, data is retrieved from Interledger (quotes, balances, transactions).
   * All communications are handled through the authenticated client instance.

---

## Intelli – Offline Runtime Layer

**Intelli** is a micro-runtime that powers the offline logic on Raspberry Pi.
It ensures smooth operation even without an internet connection.

### Responsibilities:

* Local caching of Interledger grants
* Emulated backend routes for demo purposes
* Real-time state updates for the UI
* Voice preprocessing and classification
* Simulated responses for stage presentation

In demo mode, Intelli keeps the system fully functional **without online APIs**.

---

## Demo Mode & Stage Presentation

During the Interledger 2025 demo:

* The Pi runs Intelli offline.
* When a wristband is scanned, it unlocks all features (voice, grant generation, local data sync).
* The audience can interact live through the Pi’s touchscreen.
* The UI and backend run seamlessly without network connectivity.

> We will provide a **tester wristband** for judges and evaluators.
> The system behaves exactly as the production setup — no internet required.

---

## Technology Stack

| Component       | Technology                                    |
| --------------- | --------------------------------------------- |
| UI              | Vanilla JS, HTML5, CSS3                       |
| Backend         | Node.js + Interledger Open Payments           |
| Hardware        | Raspberry Pi 4 / 5" touchscreen display       |
| Authentication  | Private key with Open Payments client         |
| Voice Input     | Local microphone (activated by NFC wristband) |
| Offline Runtime | Intelli Engine (custom lightweight layer)     |
| Local Server    | Python3 or Node static server                 |

---

## Quick Setup (Developer Mode)

```bash
# Clone the repo
git clone https://github.com/k4abrego/TaxDodgers-Interledger2025.git
cd TaxDodgers-Interledger2025

# Install dependencies for the backend
cd server
npm install

# Run the local Intelli server
node server.js

# Preview the front-end
cd ..
python3 -m http.server 8001
```

---

## License

Open source for educational and demonstration purposes only.
© 2025 — TaxDodgers Team (Interledger Hackathon)

---

> *Built with love for the Interledger 2025 Hackathon*
> *Offline-first. Secure by design. Ready for the edge.*
