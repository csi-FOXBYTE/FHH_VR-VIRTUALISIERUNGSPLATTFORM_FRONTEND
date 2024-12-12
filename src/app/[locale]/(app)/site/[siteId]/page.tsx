export default async function SiteWithIdPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;

  return <>{siteId}</>;
}
