import { useEffect, useState } from "react";

const ExplorePage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Temporary hardcoded userId — replace with dynamic value when auth is ready
  const userId = "665a1c2c4f9e40fb23a1fdd1";

  const fetchImage = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log("userId:", userId);
      fetchImage();
    }
  }, [userId]);

  return (
    <div className="explore-page" style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Explore Your Style</h1>

      {loading && <p>Generating outfit image...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="AI generated outfit"
          style={{ width: "400px", borderRadius: "12px", marginTop: "1rem" }}
        />
      )}
    </div>
  );
};

export default ExplorePage;
