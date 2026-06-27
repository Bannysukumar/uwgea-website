import { useOutletContext } from 'react-router-dom';
import { PublicPageHero, RichTextSection } from '@/features/public/components/PublicPageShell';

export default function AboutPage() {
  const { settings } = useOutletContext();
  return (
    <>
      <PublicPageHero title="About UWGEA" subtitle={settings.organization.full_name} />
      <RichTextSection html={settings.about?.content} fallback={`<p>${settings.mission.text}</p><p>${settings.vision.text}</p>`} />
    </>
  );
}
