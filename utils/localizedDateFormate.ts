import { format, Locale } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { convertNumbersToArabic } from './stringNumberSwapper';

type Locales = 'en' | 'ar';

export const localizedDateFormate = (
  date: Date | number,
  formatStr: string,
  language: string
): string => {
  const datestr = format(date, formatStr, { locale: language === 'ar' ? ar : undefined });
  return convertNumbersToArabic(datestr, language as Locales);
};
