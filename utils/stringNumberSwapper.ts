const englishToArabicMap: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
};

export const convertNumbersToArabic = (text: string, language: 'en' | 'ar'): string => {
  if (language !== 'ar') {
    return text;
  }

  return text.replace(/\d/g, (match) => englishToArabicMap[match]);
};
