import { getLocale } from "next-intl/server";
import { permanentRedirect } from "next/navigation";

export async function GET() {
  const locale = await getLocale();

  return permanentRedirect(`${locale}/my-area`);
}
