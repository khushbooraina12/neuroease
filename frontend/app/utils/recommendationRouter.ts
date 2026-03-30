export function routeFromRecommendation(id: string) {
  if (id.startsWith("breathing") || id.startsWith("grounding") || id.startsWith("meditation")) {
    return { pathname: "/interventions", params: { recommended: id } };
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

  // fallback
  return { pathname: "/interventions" };
}
