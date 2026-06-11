export function downloadChwCertificate(name: string, shopName: string, completed: number, total: number) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>BRO2BRO CHW Certificate — ${name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .cert { background: white; border: 8px solid #000; max-width: 720px; width: 100%; padding: 48px; text-align: center; }
    .logo { font-size: 13px; font-weight: 900; letter-spacing: 0.2em; color: #f59e0b; margin-bottom: 8px; }
    h1 { font-size: 28px; font-weight: 900; margin: 16px 0 8px; }
    h2 { font-size: 22px; color: #111; margin: 8px 0 24px; }
    .shop { font-size: 14px; color: #666; margin-bottom: 32px; }
    .badge { display: inline-block; background: #f59e0b; color: #000; font-weight: 900; font-size: 12px; letter-spacing: 0.15em; padding: 8px 20px; border-radius: 999px; margin: 24px 0; }
    p { font-size: 14px; color: #444; line-height: 1.7; max-width: 480px; margin: 0 auto 16px; }
    .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
    @media print { body { background: white; } }
  </style>
</head>
<body>
  <div class="cert">
    <div class="logo">BRO2BRO × UAMS</div>
    <h1>Community Health Worker</h1>
    <h1>Certificate of Completion</h1>
    <p>This certifies that</p>
    <h2>${name}</h2>
    <p class="shop">${shopName} · Little Rock, AR</p>
    <div class="badge">CHW CERTIFIED</div>
    <p>Has successfully completed ${completed} of ${total} UAMS Community Health Worker training modules, demonstrating competency in barbershop-based health screenings, client referrals, and culturally competent care navigation.</p>
    <div class="footer">Issued ${date} · BRO2BRO Health Platform · bro2bro.app</div>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
