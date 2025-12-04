module.exports = {
  useTranslations: () => (key) => key,
  NextIntlClientProvider: ({ children }) => children,
};
