document.getElementById("generateBtn").addEventListener("click", generateFlashcards);

async function generateFlashcards() {
  const topic = document.getElementById("topicInput").value;
  const container = document.getElementById("flashcardContainer");

  if (!topic) {
    container.innerHTML = "<p>Please enter a topic.</p>";
    return;
  }

  container.innerHTML = "Generating flashcards...";

  try {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    const data = await response.json();
    const flashcards = data.flashcards;

    container.innerHTML = ""; // Clear loading
    flashcards.forEach(card => {
      const div = document.createElement("div");
      div.className = "flashcard";
      div.textContent = card;
      container.appendChild(div);
    });

  } catch (error) {
    console.error("Error:", error);
    container.innerHTML = "Something went wrong. Please try again.";
  }
}
