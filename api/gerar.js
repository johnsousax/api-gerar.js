// api/gerar.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { peso, altura, objetivo } = req.body || {};
  if (!peso || !altura || !objetivo) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  const imc = (peso / (altura * altura)).toFixed(2);

  const prompt = `Gere um plano alimentar completo e saudável para uma pessoa com ${peso} kg e ${altura} m de altura cujo objetivo é ${objetivo}.
Inclua: café da manhã, almoço, jantar e lanches. Dê quantidades aproximadas e uma estimativa calórica total.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${process.env.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}\`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um nutricionista amigável e profissional." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({
    imc,
    plano: data.choices?.[0]?.message?.content || "Erro ao gerar plano"
  });
}
