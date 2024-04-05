'use client'
 
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export default function ViewList() {
  const {
    data: categorizedTagLibrary,
    error,
    isLoading,
  } = useSWR('/api/categorizedTagLibrary', fetcher);

  console.log({
    categorizedTagLibrary,
    error,
    isLoading,
  })
 
  return (
    <div>
      Hello
    </div>
  )
}
