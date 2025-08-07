import { useState, useEffect } from 'react';

const useChatGPTQuestions = () => {
  const [question, setQuestion] = useState('Loading your style question...');
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const fetchQuestion = async () => {
    if (!apiKey) {
      setError("API key missing.");
      setQuestion("What's your go-to outfit for a weekend adventure?");
      return;
    }

    try {
      setError(null); // Reset error before trying
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content:
                "Give me a fun and stylish onboarding question that helps reveal a user's fashion preferences..."
            }
          ],
          temperature: 0.9,
          max_tokens: 100
        })
      });

      if (response.status === 429) {
        throw new Error("Rate limit hit. Please wait and try again.");
      }

      if (!response.ok) {
        throw new Error(`OpenAI API responded with status ${response.status}`);
      }

      const data = await response.json();
      const gptMessage = data?.choices?.[0]?.message?.content?.trim();

      if (gptMessage) {
        setQuestion(gptMessage);
      } else {
        setQuestion("Describe your dream outfit for a beach getaway.");
      }
    } catch (err) {
      console.error("Error fetching question:", err);
      setError(err.message);
      setQuestion("Tell us about your favorite outfit.");
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { question, refreshQuestion: fetchQuestion, error };
};

export default useChatGPTQuestions;
