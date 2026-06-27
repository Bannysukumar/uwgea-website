import { useOutletContext } from 'react-router-dom';
import { PublicPageHero, RichTextSection } from '@/features/public/components/PublicPageShell';

export default function TermsPage() {
  const { settings } = useOutletContext();
  return (
    <>
      <PublicPageHero title="Terms & Conditions" />
      <RichTextSection html={settings.terms?.content} fallback="<p>Terms and conditions managed from Admin Panel → Website Settings.</p>" />
    </>
  );
}
