import { authStore } from '@/modules/auth/auth.store';
import { buildTimeConfig } from '@/modules/config/config.constants';
import { getConfig } from '@/modules/config/config.provider';
import { buildDocUrl } from '@/modules/docs/docs.models';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { useNoteContext } from '@/modules/notes/notes.context';
import { cn } from '@/modules/shared/style/cn';
import { useThemeStore } from '@/modules/theme/theme.store';
import { Button } from '@/modules/ui/components/button';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';

import { A, useNavigate } from '@solidjs/router';
import { type Component, type ParentComponent, Show } from 'solid-js';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../components/dropdown-menu';

const ThemeSwitcher: Component = () => {
  const themeStore = useThemeStore();
  const { t } = useI18n();

  return (
    <>
      <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'light' })} class="flex items-center gap-2 cursor-pointer">
        <div class="i-tabler-sun text-lg"></div>
        {t('navbar.theme.light-mode')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'dark' })} class="flex items-center gap-2 cursor-pointer">
        <div class="i-tabler-moon text-lg"></div>
        {t('navbar.theme.dark-mode')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'system' })} class="flex items-center gap-2 cursor-pointer">
        <div class="i-tabler-device-laptop text-lg"></div>
        {t('navbar.theme.system-mode')}
      </DropdownMenuItem>
    </>
  );
};

const LanguageSwitcher: Component = () => {
  const { t, getLocale, setLocale, locales } = useI18n();

  return (
    <>
      {locales.map(locale => (
        <DropdownMenuItem onClick={() => setLocale(locale.key)} class={cn('flex items-center gap-2 cursor-pointer', { 'font-semibold': getLocale() === locale.key })}>
          {locale.name}
        </DropdownMenuItem>
      ))} 
      
    </>
  );
};

export const Navbar: Component = () => {
  const themeStore = useThemeStore();
  const { triggerResetNoteForm } = useNoteContext();
  const navigate = useNavigate();
  const { t } = useI18n();

  const config = getConfig();

  const newNoteClicked = () => {
    triggerResetNoteForm();
    navigate('/');
  };

  return (
    <div class="border-b border-border bg-surface">
      <div class="flex items-center justify-between px-6 py-3 mx-auto max-w-1200px">
        <div class="flex items-baseline gap-4">
          <Button variant="link" class="text-lg font-semibold border-b border-transparent hover:(no-underline !border-border) h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250" onClick={newNoteClicked}>
            {t('app.title')}
          </Button>

          <span class="text-muted-foreground hidden sm:block">
            {t('app.description')}
          </span>
        </div>

        <div class="flex gap-2 items-center">
          <Button variant="secondary" onClick={newNoteClicked}>
            <div class="i-tabler-plus mr-1 text-muted-foreground"></div>
            {t('navbar.new-note')}
          </Button>

         

          <DropdownMenu>
            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9 hidden md:inline-flex" variant="ghost" aria-label="Change theme">
              <div classList={{ 'i-tabler-moon': themeStore.getColorMode() === 'dark', 'i-tabler-sun': themeStore.getColorMode() === 'light' }}></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-42">
              <ThemeSwitcher />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9 hidden md:inline-flex" variant="ghost" aria-label="Language">
              <div class="i-custom-language size-4"></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <LanguageSwitcher />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>

            

            <DropdownMenuContent class="w-46">

              {/* Mobile only items */}
             

              <DropdownMenuSub>
                <DropdownMenuSubTrigger as="a" class="flex items-center gap-2 md:hidden" aria-label="Change theme">
                  <div class="text-lg" classList={{ 'i-tabler-moon': themeStore.getColorMode() === 'dark', 'i-tabler-sun': themeStore.getColorMode() === 'light' }}></div>
                  {t('navbar.theme.theme')}
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  <ThemeSwitcher />
                </DropdownMenuSubContent>

              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger as="a" class="flex items-center text-medium gap-2 md:hidden" aria-label="Change language">
                  <div class="i-custom-language size-4"></div>
                  {t('navbar.language')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <LanguageSwitcher />
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Default items */} 
              {config.isAuthenticationRequired && authStore.getIsAuthenticated() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="flex items-center gap-2 cursor-pointer" onClick={() => authStore.logout()}>
                    <div class="i-tabler-logout text-lg"></div>
                    {t('navbar.settings.logout')}
                  </DropdownMenuItem>
                </>
              )}

            </DropdownMenuContent>

          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export const Footer: Component = () => {
  const { t } = useI18n();

  return (
    <div class="bg-surface border-t border-border py-6 px-6 text-center text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-1">
     <div class="footer-content">
       <a href="https://www.youtube.com/channel/UCn0Yarp_h6oqn1-QLvlgbDg?sub_confirmation=1" target="_blank" rel="nofollow noopener"><span>Youtube</span></a>
       - <a href="https://www.zymn.cc" target="_blank" rel="nofollow noopener"><span>{t('footer.blog')}</span></a>
       - <a href="https://twitter.com/spatacus1986" target="_blank" rel="nofollow noopener"><span>Twitter</span></a>
       - <a href="https://t.me/+8W45Y29o5T1mMGI1" target="_blank" rel="nofollow noopener"><span>{t('footer.telegram')}</span></a>
       - <a href="https://v.douyin.com/iNpPYY4E/" target="_blank" rel="nofollow noopener"><span>抖音</span></a>
       - <a href="https://www.ixigua.com/home/103680436540" target="_blank" rel="nofollow noopener"><span>西瓜视频</span></a> 
    </div>
    </div>
  );
};

export const AppLayout: ParentComponent = (props) => {
  const getIsSecureContext = () => {
    return window.isSecureContext ?? window.location.protocol === 'https:';
  };

  const { t } = useI18n();

  return (
    <div class="flex flex-col h-screen min-h-0">
      <Show when={!getIsSecureContext()}>
        <div class="bg-warning px-6 py-2 text-center gap-2 justify-center bg-op-20 text-warning text-pretty">
          <div class="i-tabler-alert-triangle text-base hidden lg:inline-block vertical-mid mr-2"></div>
          {t('insecureContextWarning.description')}
          {' '}
          <a href={buildDocUrl({ path: '/self-hosting/troubleshooting#why-do-i-see-a-warning-about-insecure-connexion' })} target="_blank" rel="noopener noreferrer" class="underline hover:text-primary transition">
            {t('insecureContextWarning.learn-more')}
          </a>
        </div>
      </Show>

      <Navbar />

      <div class="flex-1 pb-20 ">{props.children}</div>

      <Footer />

    </div>
  );
};
