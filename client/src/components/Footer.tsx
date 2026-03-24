import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full py-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} Muscle Anatomy Hub. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;