import React, { memo } from 'react';
import { Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/format';

type Props = {
  price: number;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = { sm: 13, md: 15, lg: 22 };

const PriceTag = ({ price, size = 'md' }: Props) => {
  const { colors } = useTheme();
  return (
    <Text style={{ fontSize: sizes[size], fontWeight: '800', color: colors.primary }}>
      {formatINR(price)}
    </Text>
  );
};

export default memo(PriceTag);
