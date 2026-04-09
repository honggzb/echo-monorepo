"use client";

import WidgetView from "@/modules/widget/ui/views/widget-view";
import { use } from "react";

interface PageProps {
  searchParams: Promise<{ organizationId: string }>;
}

const Page = ({ searchParams }: PageProps) => {
  const { organizationId } = use(searchParams);

  return (
    <WidgetView organizationId={organizationId}  />
  )
}

export default Page;

// http://localhost:3001/?organizationId=org_3AlUuPMDBzt0jzB685wVRgznERI
