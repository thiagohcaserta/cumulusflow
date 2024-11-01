export default async function handler(req) {
  const { city } = new URL(req.url).searchParams;
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`
  );
  
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}