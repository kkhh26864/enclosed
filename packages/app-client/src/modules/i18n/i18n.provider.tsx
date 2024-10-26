import type { ParentComponent } from 'solid-js';
import * as i18n from '@solid-primitives/i18n';
import { makePersisted } from '@solid-primitives/storage';
import { merge } from 'lodash-es';
import { createContext, createResource, createSignal, Show, useContext } from 'solid-js';
import defaultDict from '../../locales/zh-CN.json';

export {
  useI18n,
};

const locales = [
  {
    key: 'zh-CN',
    file: 'zh-CN',
    name: '简体中文',
  },
  {
    key: 'zh-TW',
    file: 'zh-TW',
    name: '繁體中文',
  },
  {
    key: 'en',
    file: 'en',
    name: 'English',
  },
  {
    key: 'de',
    file: 'de',
    name: 'Deutsch',
  },
  {
    key: 'fr',
    file: 'fr',
    name: 'Français',
  },
  {
    key: 'es',
    file: 'es',
    name: 'Español',
  },
  {
    key: 'ru',
    file: 'ru',
    name: 'Русский',
  },
 
] as const;

type Locale = typeof locales[number]['key'];
type RawDictionary = typeof defaultDict;
type Dictionary = i18n.Flatten<RawDictionary>;

const I18nContext = createContext<{
  t: i18n.Translator<Dictionary>;
  getLocale: () => Locale;
  setLocale: (locale: Locale) => void;
  locales: typeof locales;
} | undefined>(undefined);

function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('I18n context not found');
  }

  return context;
}

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = (await import(`../../locales/${locale}.json`));
  const mergedDict = merge({}, defaultDict, dict);
  const flattened = i18n.flatten(mergedDict);

  return flattened;
}

function getBrowserLocale(): Locale {
  const browserLocale = navigator.language;

  if (!browserLocale) {
    return 'zh-CN'; // 默认返回简体中文
  }

  // 检查完整的语言代码（例如 'zh-TW'）
  const exactMatch = locales.find(locale => locale.key === browserLocale);
  if (exactMatch) {
    return exactMatch.key;
  }

  // 如果没有完全匹配，则检查语言代码的第一部分（例如 'zh'）
  const languageCode = browserLocale.split('-')[0];
  const partialMatch = locales.find(locale => locale.key.startsWith(languageCode));
  if (partialMatch) {
    return partialMatch.key;
  }

  return 'zh-CN'; // 如果没找到匹配的语言，默认使用简体中文
}

export const I18nProvider: ParentComponent = (props) => {
  const browserLocale = getBrowserLocale();
  const [getLocale, setLocale] = makePersisted(createSignal<Locale>(browserLocale), { name: 'enclosed_locale', storage: localStorage });

  const [dict] = createResource(getLocale, fetchDictionary);

  return (
    <Show when={dict()}>
      {dict => (
        <I18nContext.Provider
          value={{
            t: i18n.translator(dict),
            getLocale,
            setLocale,
            locales,
          }}
        >
          {props.children}
        </I18nContext.Provider>
      )}
    </Show>
  );
};
