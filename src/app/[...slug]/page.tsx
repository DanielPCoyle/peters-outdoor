import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";

export const dynamic = "force-dynamic";

const BUILDER_API_KEY = process.env.BUILDERIO_PUBLIC_API_KEY ?? "";

async function getContent(slug: string[], searchParams: Record<string, string>) {
  if (!BUILDER_API_KEY) return null;
  const urlPath = "/" + slug.join("/");
  return fetchOneEntry({
    model: "page",
    apiKey: BUILDER_API_KEY,
    cacheSeconds: 1,
    staleCacheSeconds: 1,
    fetchOptions: { cache: "no-store" },
    options: { noCache: "true", cachebust: "true", ...getBuilderSearchParams(searchParams) },
    userAttributes: { urlPath },
  });
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const content = await getContent(slug, sp);
  if (!content) return {};
  const data = (content.data ?? {}) as { title?: string; description?: string };
  return {
    title: data.title,
    description: data.description,
  };
}

export default async function BuilderCatchAllPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const content = await getContent(slug, sp);

  if (!content) {
    notFound();
  }

  return <BuilderContentWrapper content={content} apiKey={BUILDER_API_KEY} />;
}
