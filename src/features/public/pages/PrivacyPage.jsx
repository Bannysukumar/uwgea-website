import { useOutletContext } from 'react-router-dom';
import { PublicPageHero, RichTextSection } from '@/features/public/components/PublicPageShell';

export default function PrivacyPage() {
  const { settings } = useOutletContext();
  return (
    <>
      <PublicPageHero title="Privacy Policy" />
      <RichTextSection html={settings.privacy?.content} fallback="<p>Privacy policy content managed from Admin Panel → Website Settings.</p>" />
    </>
  );
}
