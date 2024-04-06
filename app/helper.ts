export const fetcher = (url: string, init?: RequestInit | undefined) =>
  fetch(url, init)
    .then((res) => res.json())
    .then((json) => json.data);

export function setupUrl(
  url: string,
  params: Record<string, string> = {}
) {
  const searchParams = new URLSearchParams(params)
  return `${url}?` + searchParams
}
