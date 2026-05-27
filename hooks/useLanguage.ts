import { useWeatherContext } from '../context/WeatherContext';
import { STRINGS, StringKey } from '../constants/strings';

export function useLanguage() {
  const { lang, setLang } = useWeatherContext();
  const t = (key: StringKey): string => STRINGS[lang][key] as string;
  return { lang, setLang, t };
}
