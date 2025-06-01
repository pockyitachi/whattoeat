
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is supported' });
  }

  const { ingredients } = req.body;
  if (!ingredients || ingredients.trim() === "") {
    return res.status(400).json({ error: 'Missing ingredients' });
  }

  const prompt = `我手上有这些食材：${ingredients}。请推荐一道可以做的中文家常菜，并简要说明做法，不超过150字。`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "你是一个家庭厨师助手，会根据食材给出菜谱推荐。" },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "生成失败";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: '请求失败', detail: error.message });
  }
}
