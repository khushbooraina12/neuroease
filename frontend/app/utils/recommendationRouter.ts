export function routeFromRecommendation(id: string) {
  console.log("Received Recommendation:", id);

  if (!id) {
    return {
      pathname: "/interventions",
      params: { recommended: "breathing_01" },
    };
  }

  if (
    id.startsWith("breathing") ||
    id.startsWith("grounding") ||
    id.startsWith("meditation") ||
    id.startsWith("gratitude")
  ) {
    return {
      pathname: "/interventions",
      params: { recommended: id },
    };
  }

  if (id.startsWith("workout")) {
    return { pathname: "/workouts" };
  }

  if (id.startsWith("therapy")) {
    return { pathname: "/therapy" };
  }

  if (id.startsWith("message")) {
    return { pathname: "/messages" };
  }

  // smart fallback
  return {
    pathname: "/interventions",
    params: { recommended: "breathing_01" },
  };
}