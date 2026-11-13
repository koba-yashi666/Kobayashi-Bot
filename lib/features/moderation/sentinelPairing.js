// O QR sinaliza que o handshake de autenticação está pronto para pedir o código.
export function requestSentinelPairingCode(sock, phoneNumber, { timeoutMs = 60000 } = {}) {
  return new Promise((resolve, reject) => {
    let requested = false, settled = false;
    const finish = (error, code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      sock.ev.off("connection.update", onUpdate);
      error ? reject(error) : resolve(code);
    };
    const onUpdate = update => {
      if (update.connection === "close") {
        const status = update.lastDisconnect?.error?.output?.statusCode ||
          update.lastDisconnect?.error?.statusCode;
        finish(new Error(`Conexão do Sentinela encerrada antes de gerar o código${status ? " (HTTP " + status + ")" : ""}. Tente novamente.`));
        return;
      }
      if (!update.qr || requested || settled) return;
      requested = true;
      Promise.resolve().then(() => sock.requestPairingCode(phoneNumber)).then(raw => {
        const code = String(raw || "").replace(/-/g, "").trim();
        if (!/^[A-Za-z0-9]{8}$/.test(code)) throw new Error("O WhatsApp não retornou um código de pareamento válido.");
        finish(null, code.match(/.{1,4}/g).join("-"));
      }).catch(error => finish(new Error(`Não foi possível gerar o código do Sentinela${error?.output?.statusCode ? " (HTTP " + error.output.statusCode + ")" : ""}. Tente novamente em alguns minutos.`)));
    };
    const timer = setTimeout(() => finish(new Error("Tempo esgotado ao preparar o Sentinela. Confira a conexão da hospedagem e tente novamente.")), timeoutMs);
    sock.ev.on("connection.update", onUpdate);
  });
}
