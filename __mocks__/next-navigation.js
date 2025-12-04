module.exports = {
  usePathname: () => "/es/test",
  useRouter: () => ({
    push: jest.fn(),
  }),
};
