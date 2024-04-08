import { UrlFaviconFinder } from "@/shared/UrlFaviconFinder";

export async function POST(request: Request) {
  const { source } = await request.json();

  const finder = new UrlFaviconFinder();
  try {
    await finder.initial();

    const imgUrl = await finder.find(source);

    if (!imgUrl) {
      return Response.json({ ok: false, msg: 'No Favicon found' })
    }

    const url = { url: imgUrl };
    return Response.json({ ok: true, data: url })
  } catch (ex) {
    const errorMessage = `Error finding Favicon: $${(ex as Error).message}`;
    return Response.json({ ok: false, msg: errorMessage })
  } finally {
    finder.close();
  }
}
