import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
server.listen(3000, () => console.log("🚀 Backend corriendo en http://localhost:3000"));

io.on("connection", socket => console.log("🔗 Front conectado:", socket.id));

const clients = {
      "4200532228": {
        publicName: data.publicName,
        assetCode: data.assetCode,
        amountToCharge: 50 
      },
      "4200697860": {
        publicName: data.publicName,
        assetCode: data.assetCode,
        amountToCharge: 75
      }
    };

app.post("/process-audio", async (req, res) => {
  const uid = req.query.uid;4200697860
  
  const walletInfo = uidWalletMap[uid] || { publicName: "Desconocido", amountToCharge: 0 };

  const responseContent = `Cliente: ${walletInfo.publicName}\nMonto a cobrar: $${walletInfo.amountToCharge}`;
  console.log("🤖 Respuesta:", responseContent);

  io.emit("intelli-response", { uid, content: responseContent });

  res.json({ ok: true, content: responseContent });
});

process.stdin.setEncoding("utf8");
let bufferUID = "";
let currentUID = null;
console.log("💳 Acerca un tag RFID...");

process.stdin.on("data", data => {
  if (!currentUID) {
    bufferUID += data.trim();
    if (data.includes("\n") || data.includes("\r")) {
      currentUID = bufferUID.trim();
      bufferUID = "";
      const walletInfo = uidWalletMap[currentUID] || { publicName: "Desconocido", assetCode: "MXN", amountToCharge: 0 };
      console.log(`💳 UID detectado: ${currentUID}`);
      io.emit("wallet-match", {
        uid: currentUID,
        publicName: walletInfo.publicName,
        assetCode: walletInfo.assetCode,
        amountToCharge: walletInfo.amountToCharge
      });
      currentUID = null;
      console.log("💳 Acerca otro tag RFID...");
    }
  }
});