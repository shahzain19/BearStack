export async function moderateWithGemini(content: string): Promise<boolean> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Check the following content for the following:
- Strong profanity
- Racial slurs or hate speech
- Anything inappropriate for an audience under 16 (PG16+)

If the content contains any of the above, return only: "yes"
If it is clean and safe for public forums, return only: "no"

Content:
${content}
                `.trim(),
              },
            ],
          },
        ],
      }),
    }
  );

  const result = await res.json();

  // 🧪 Log full response for testing
  console.log("Moderation result:", result);

  const output =
    result?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() ?? "";

  return output.includes("yes");
}
