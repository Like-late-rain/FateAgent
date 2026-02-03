import { Card } from '@/components/ui/card';
import { DISCLAIMER_TEXT } from '@/utils/constants';

export function AnalysisDisclaimer() {
  return (
    <Card>
      <p className="whitespace-pre-line text-xs text-ink/60">{DISCLAIMER_TEXT}</p>
    </Card>
  );
}
