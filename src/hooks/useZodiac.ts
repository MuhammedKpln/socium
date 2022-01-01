import { getZodiac, IZodiac } from '@/utils/zodiac'
import { useMemo } from 'react'

export function useZodiac(date: string): IZodiac {
  const zodiac = useMemo(() => {
    return getZodiac(date)
  }, [date])

  return zodiac
}
