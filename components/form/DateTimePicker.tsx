import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'tamagui';

interface DateTimeSelectorProps {
  mode: 'date' | 'time';

  onTimeChange: (event: DateTimePickerEvent, selectedValue?: Date) => void;
  selectedDate: string;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  mode,
  onTimeChange,
  selectedDate,
}) => {
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);
  return (
    <>
      <Button
        onPress={() => setShow(true)}
        icon={<FontAwesome name={mode === 'date' ? 'calendar' : 'clock-o'} size={20} />}>
        {mode === 'date' ? t('select_date') : t('select_time')}
      </Button>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(selectedDate)}
          mode={mode}
          is24Hour
          display="default"
          onChange={(e, d) => {
            onTimeChange(e, d);
            setShow(false);
          }}
        />
      )}
    </>
  );
};
