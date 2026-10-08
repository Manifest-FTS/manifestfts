import { redirect } from 'next/navigation';

export default async function WorkspaceIndex({ params }: PageProps<'/app/[workspace]'>) {
  redirect(`/app/${(await params).workspace}/overview`);
}
