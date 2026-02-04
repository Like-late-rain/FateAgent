import { Card, CardContent } from '@/components/ui/card';
import { DISCLAIMER_TEXT } from '@/utils/constants';

export function AnalysisDisclaimer() {
  return (
    <Card>
      <CardContent>
        <p className="whitespace-pre-line text-xs text-muted-foreground">
          {DISCLAIMER_TEXT}
        </p>
      </CardContent>
    </Card>
  );
}
