import fs from "fs";
import pkg from "@interledger/open-payments";
const { createAuthenticatedClient, isFinalizedGrant } = pkg;

(async () => {
  try {
    // --- 1 Cargar llave privada ---
    const privateKey = fs.readFileSync("private.key", "utf-8");

    // --- 2 Autentica el cliente ---
    const client = await createAuthenticatedClient({
      walletAddressUrl: "https://ilp.interledger-test.dev/mvr6",
      privateKey,
      keyId: "83a0b493-e304-4388-aa70-ab7a03da6055",
    });

    // --- 3️ Obtener metadata de la wallet ---
    const wallet = await client.walletAddress.get({
      url: "https://ilp.interledger-test.dev/mvr6",
    });

    console.log("✅ Metadata de la wallet:");
    console.log(wallet);

    // --- 4️ Solicitar grant para pagos entrantes ---
    const incomingGrant = await client.grant.request(
      { url: wallet.authServer },
      {
        access_token: {
          access: [
            { type: "incoming-payment", actions: ["read", "list"] },
          ],
        },
      }
    );

    if (!isFinalizedGrant(incomingGrant)) {
      throw new Error("Se espera que el grant se finalice");
    }

    console.log("🔑 Grant recibido para pagos entrantes:", incomingGrant.access_token.value);

    const incomingPayments = await client.incomingPayment.list({
        url: `${wallet.resourceServer}/incoming-payments`,
        accessToken: incomingGrant.access_token.value,
    });

    console.log("\n🔹 Pagos entrantes:");
    incomingPayments.forEach((p) => {
      console.log(`- ID: ${p.id}`);
      console.log(`  Estado: ${p.state}`);
      console.log(`  Solicitado: ${p.incomingAmount?.value || 0} ${p.incomingAmount?.assetCode}`);
      console.log(`  Recibido:   ${p.receivedAmount?.value || 0} ${p.receivedAmount?.assetCode}`);
    });

    const outgoingGrant = await client.grant.request(
      { url: wallet.authServer },
      {
        access_token: {
          access: [
            { type: "outgoing-payment", actions: ["read", "list"] },
          ],
        },
      }
    );

    if (!isFinalizedGrant(outgoingGrant)) {
      throw new Error("Se espera que el grant se finalice");
    }

    console.log("🔑 Grant recibido para pagos salientes:", outgoingGrant.access_token.value);

    const outgoingPayments = await client.outgoingPayment.list({
        url: `${wallet.resourceServer}/outgoing-payments`,
        accessToken: outgoingGrant.access_token.value,
    });

    console.log("\n🔹 Pagos salientes:");
    outgoingPayments.forEach((p) => {
      console.log(`- ID: ${p.id}`);
      console.log(`  Estado: ${p.state}`);
      console.log(`  Monto: ${p.amount?.value || 0} ${p.amount?.assetCode}`);
    });

    const totalReceived = incomingPayments.reduce(
      (sum, p) => sum + Number(p.receivedAmount?.value || 0),
      0
    );
    const totalSent = outgoingPayments.reduce(
      (sum, p) => sum + Number(p.amount?.value || 0),
      0
    );
    const balance = totalReceived - totalSent;

    console.log(`\n💰 Balance simulado: ${balance} ${wallet.assetCode}`);

  } catch (err) {
    console.error("Continue en la app");
  }
})();