import { useMemo, useState } from 'react';
import { Sheet } from 'tamagui';

export default function ConfiguredSheet({ children }: { children?: React.ReactNode }) {
  const snapPoints = useMemo(() => [85, 50, 35], []);

  const [sheetPosition, setSheetPosition] = useState(snapPoints.length - 1);
  return (
    <Sheet
      open
      snapPoints={snapPoints}
      snapPointsMode="percent"
      dismissOnOverlayPress={false}
      dismissOnSnapToBottom={false}
      position={sheetPosition}
      onPositionChange={setSheetPosition}
      zIndex={100}>
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" space="$5">
        {children}
      </Sheet.Frame>
    </Sheet>
  );
}
