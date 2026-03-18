"use client";

import { Content } from "@builder.io/sdk-react";
import type { BuilderContent } from "@builder.io/sdk-react";
import { builderComponents } from "@/builder-registry";

interface BuilderContentWrapperProps {
  content: BuilderContent | null;
  apiKey: string;
  model?: string;
}

export default function BuilderContentWrapper({
  content,
  apiKey,
  model = "page",
}: BuilderContentWrapperProps) {
  return (
    <Content
      content={content}
      model={model}
      apiKey={apiKey}
      customComponents={builderComponents}
    />
  );
}
