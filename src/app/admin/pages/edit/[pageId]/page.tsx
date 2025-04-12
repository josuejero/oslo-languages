
import EditorClient from "./editor-client";

export default function EditPage({
  params,
}: {
  params: { pageId: string };
}) {
  return <EditorClient pageId={params.pageId} />;
}