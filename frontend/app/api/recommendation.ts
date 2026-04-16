export async function getRecommendation(
  journalText: string,
  userState: number[]
) {
  const response = await fetch("http://192.168.56.1:5000/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      journal_text: journalText,
      user_state: userState,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendation");
  }

  const data = await response.json();
  return data.intervention_id as string;
}
