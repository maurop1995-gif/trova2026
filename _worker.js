// Configuracion necesaria en Cloudflare Pages:
// - GOOGLE_PLACES_API_KEY: secreto (nunca debe copiarse al HTML o al JavaScript publico).
// - GOOGLE_PLACE_ID: variable de texto opcional; se usa DEFAULT_PLACE_ID si no existe.
const DEFAULT_PLACE_ID = "ChIJH3wo1T-Bn5URWbjYHGGrkHo";
const GOOGLE_REVIEWS_PATH = "/api/google-reviews.php";
const CACHE_SECONDS = 86400;

const jsonResponse = (payload, status = 200, cacheControl = "no-store") =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff",
    },
  });

const normalizeReviews = (reviews) =>
  (Array.isArray(reviews) ? reviews : []).slice(0, 5).map((review) => ({
    author: String(review.authorAttribution?.displayName || "Cliente de Google"),
    author_uri: String(review.authorAttribution?.uri || ""),
    author_photo_uri: String(review.authorAttribution?.photoUri || ""),
    rating: Number(review.rating || 0),
    text: String(review.text?.text || review.originalText?.text || ""),
    relative_time: String(review.relativePublishTimeDescription || ""),
    publish_time: String(review.publishTime || ""),
    google_maps_uri: String(review.googleMapsUri || ""),
  })).filter((review) => review.text);

const fetchGoogleReviews = async (env) => {
  if (!env.GOOGLE_PLACES_API_KEY) {
    throw new Error("GOOGLE_PLACES_API_KEY no está configurada.");
  }

  const placeId = env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;
  const endpoint = new URL(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
  );
  endpoint.searchParams.set("languageCode", "es");
  endpoint.searchParams.set("regionCode", "UY");

  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask":
        "id,displayName,rating,userRatingCount,googleMapsUri,reviews",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Places respondió con estado ${response.status}.`);
  }

  const place = await response.json();
  return {
    name: String(place.displayName?.text || "Heladería Los Trovadores"),
    rating: Number(place.rating || 0),
    user_ratings_total: Number(place.userRatingCount || 0),
    google_maps_uri: String(place.googleMapsUri || ""),
    reviews: normalizeReviews(place.reviews),
    source: "places_new",
    updated_at: new Date().toISOString(),
  };
};

const handleGoogleReviews = async (request, env, context) => {
  if (request.method !== "GET") {
    return jsonResponse({ error: "Método no permitido." }, 405);
  }

  const requestUrl = new URL(request.url);
  const cacheKey = new Request(
    `${requestUrl.origin}${GOOGLE_REVIEWS_PATH}`,
    { method: "GET" },
  );
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const payload = await fetchGoogleReviews(env);
    const response = jsonResponse(
      payload,
      200,
      `public, max-age=300, s-maxage=${CACHE_SECONDS}`,
    );
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    console.error("No se pudieron sincronizar las reseñas de Google.", error);
    return jsonResponse(
      { error: "Las reseñas no están disponibles temporalmente." },
      503,
    );
  }
};

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    if (url.pathname === GOOGLE_REVIEWS_PATH) {
      return handleGoogleReviews(request, env, context);
    }

    return env.ASSETS.fetch(request);
  },
};
