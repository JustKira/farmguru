import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useMemo } from 'react';

export const useCategories = ({ color }: { color: string }) => {
  return useMemo(() => {
    return [
      {
        label: 'Insect',
        value: 'insect',
        icon: () => <FontAwesome name="bug" size={20} color={color} />,
      },
      {
        label: 'Disease',
        value: 'disease',
        icon: () => <FontAwesome5 name="virus" size={20} color={color} />,
      },
      {
        label: 'Growth',
        value: 'growth',
        icon: () => <Entypo name="leaf" size={20} color={color} />,
      },
      {
        label: 'Others',
        value: 'others',
        icon: () => <Entypo name="dots-three-horizontal" size={20} color={color} />,
      },
      {
        label: 'Dont Know',
        value: 'dontknow',
        icon: () => <FontAwesome5 name="question" size={20} color={color} />,
      },
    ];
  }, [color]);
};
