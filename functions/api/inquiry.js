// PepVeri — 询价表单收信接口（Cloudflare Pages Function）
// POST /api/inquiry  →  通过 Resend 转发到 business@pepveri.com
// 需要 Pages 环境变量：RESEND_API_KEY（可选 FROM_EMAIL、TO_EMAIL）

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// 诊断用：浏览器直接打开 /api/inquiry 可查看配置状态（不泄露密钥）
export async function onRequestGet({ env }) {
  return json({
    ok: true,
    endpoint: "/api/inquiry",
    resend_key_configured: Boolean(env.RESEND_API_KEY),
    resend_key_prefix: env.RESEND_API_KEY ? String(env.RESEND_API_KEY).slice(0, 3) : null,
    from_email: env.FROM_EMAIL || "onboarding@resend.dev (default)",
    to_email: env.TO_EMAIL || "business@pepveri.com (default)",
  });
}

export async function onRequestPost({ request, env }) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    return json({ ok: false, error: "Email service not configured (missing RESEND_API_KEY)" }, 500);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const phone = (data.phone || "").trim();
  const company = (data.company || "").trim();
  const product = (data.product || "").trim();
  const quantity = (data.quantity || "").trim();
  const message = (data.message || "").trim();

  if (!name || !email || !phone) {
    return json({ ok: false, error: "Name, email and phone are required" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Invalid email address" }, 400);
  }

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone / WhatsApp", phone],
    ["Company", company || "—"],
    ["Target Ingredient", product || "—"],
    ["Required Quantity", quantity || "—"],
    ["Message", message || "—"],
  ].map(([k, v]) => `
    <tr>
      <td style="padding:8px 14px;font-weight:700;color:#1f3b73;white-space:nowrap;vertical-align:top">${esc(k)}</td>
      <td style="padding:8px 14px;color:#14213d">${esc(v).replace(/\n/g, "<br>")}</td>
    </tr>`).join("");

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;border:1px solid #dfe6f2;border-radius:12px;overflow:hidden">
      <div style="background:#1f3b73;color:#fff;padding:18px 24px">
        <div style="font-size:18px;font-weight:800">New Wholesale Inquiry — PepVeri Website</div>
        <div style="font-size:13px;opacity:.85;margin-top:4px">Submitted via www.pepveri.com contact form</div>
      </div>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>
      <div style="background:#f2f5fb;padding:12px 24px;font-size:12px;color:#4a5a76">
        Reply directly to this email to answer the customer (reply-to is set to their address).
      </div>
    </div>`;

  const from = env.FROM_EMAIL || "PepVeri Website <onboarding@resend.dev>";
  const to = env.TO_EMAIL || "business@pepveri.com";

  let res;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New Wholesale Inquiry — ${name}${company ? " / " + company : ""}`,
        html,
      }),
    });
  } catch {
    return json({ ok: false, error: "Email service unreachable" }, 502);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const hint =
      res.status === 401 ? "RESEND_API_KEY is invalid or revoked — create a new key at resend.com/api-keys." :
      res.status === 403 ? "Resend rejected the sender. Verify the domain pepveri.com in Resend, or set FROM_EMAIL to an address on a verified domain." :
      res.status === 422 ? "Resend validation failed — usually the 'from' address is not on a verified domain." :
      "";
    return json({ ok: false, error: `Email provider error (${res.status})`, hint, detail: detail.slice(0, 300) }, 502);
  }

  return json({ ok: true });
}
