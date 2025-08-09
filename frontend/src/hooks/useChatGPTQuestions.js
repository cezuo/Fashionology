import { useEffect, useRef, useState } from "react";

const useChatGPTQuestions = () => {
  const [questions, setQuestions] = useState([
    "Loading your style questions..."
  ]);
  const [error, setError] = useState(null);
  const apiKey = (import.meta.env.VITE_OPENAI_API_KEY || "").trim();
  const fetchedRef = useRef(false);

  const fetchQuestions = async () => {
    if (!apiKey) {
      setError("API key missing (VITE_OPENAI_API_KEY).");
      setQuestions([
        "What's your go-to outfit for a weekend adventure?",
        "If you could wear one color forever, what would it be?",
        "What's one accessory you can't live without?"
      ]);
      return;
    }

    try {
      setError(null);
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You write short, fun, and engaging fashion onboarding questions."
            },
            {
              role: "user",
              content: `Generate 3 short, fun, and unique fashion onboarding questions that will help capture enough personal detail to later generate an outfit image for the user. 
The questions should be different every time, randomized in style and focus. 
Make them conversational, not generic. 
Pull from these themes, mixing them up:
- The user's favorite type of music and how it influences their fashion sense
- Fashion brands or designers that stand out to them
- Favorite fashion pieces from specific years or eras
- Clothing brand collections or trends they are most fond of
- Seasonal fashion preferences (autumn/winter vs spring/summer)
- Cultural or nostalgic style inspirations
Return ONLY the 3 questions as a numbered list, no extra text.`
            }
          ],
          temperature: 0.9,
          max_tokens: 150,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI error ${res.status}`);
      }

      const data = await res.json();
      const gpt = data?.choices?.[0]?.message?.content?.trim();

      if (gpt) {
        const parsed = gpt
          .split("\n")
          .map(q => q.replace(/^\d+\.\s*/, "").trim())
          .filter(Boolean);
        setQuestions(parsed);
      } else {
        setQuestions([
          "Describe your dream outfit for a beach getaway.",
          "What's a color combo that makes you feel confident?",
          "What's your favorite accessory and why?"
        ]);
      }
    } catch (err) {
      setError(err.message);
      setQuestions([
        "Tell us about your favorite outfit.",
        "What's a color that always boosts your mood?",
        "What's one piece of clothing you'd never give up?"
      ]);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchQuestions();
  }, []);

  return { questions, refreshQuestions: fetchQuestions, error };
};

export default useChatGPTQuestions;
