"use client";

import { useParams } from "next/navigation";
import ProjectForm from "@/components/projects/ProjectForm";
import { useGetProjectQuery } from "@/redux/features/project/projectApi";

export default function EditProjectPage() {
  const { id } = useParams();
  const { data: project, isLoading } = useGetProjectQuery(id);

  if (isLoading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
        <p className="text-foreground/60 mt-1">
          Update the details for "{project.name}"
        </p>
      </div>
      <ProjectForm initialData={project} isEditing />
    </div>
  );
}
