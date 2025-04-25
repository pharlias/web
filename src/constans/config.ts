const configApp = {
  appName: "Pharlias",
  appLogo: "https://res.cloudinary.com/dutlw7bko/image/upload/v1743290524/americanolabs/kdfekme0elfehvlv22ra.png",
  pharos: {
    chainId: 50002,
    logo: "https://res.cloudinary.com/dutlw7bko/image/upload/v1745240985/hackthon/pharos_zdfrra.png",
    rpc: "https://devnet.dplabs-internal.com",
    explorer: "https://pharosscan.xyz"
  },
  links: {
    github: "https://github.com/pharlias",
    docs: "https://gitbook.io",
    twitter: "https://x.com",
    logo: "/trademark/icon-light.svg"
  },
  routes: [
    {
      href: "/home",
      label: "Home"
    },
    {
      href: "/transfers",
      label: "Transfer"
    },
    {
      href: "/manage",
      label: "Manage"
    }
  ],
  routesMobile: [
    {
      description: 'Get started with your app',
      href: '/home',
      icon: 'home',
      label: 'Home'
    },
    {
      description: 'Transfer your assets',
      href: '/transfers',
      icon: 'transfer',
      label: 'Transfer',
    },
    {
      description: 'Manage your assets',
      href: '/manage',
      icon: 'dashboard',
      label: 'Manage',
    }
  ],
  public: {
    brands: [
      {
        name: "coinbase",
        logo: "/brands/coinbase.png",
        href: "https://www.coinbase.com/"
      },
      {
        name: "binance",
        logo: "/brands/binance.png",
        href: "https://www.binance.com/"
      },
      {
        name: "kraken",
        logo: "/brands/kraken.png",
        href: "https://www.kraken.com/"
      },
      {
        name: "bitfinex",
        logo: "/brands/bitfinex.png",
        href: "https://www.bitfinex.com/"
      },
      {
        name: "bittrex",
        logo: "/brands/bittrex.jpg",
        href: "https://www.bittrex.com/"
      },
      {
        name: "openai",
        logo: "/brands/openai.png",
        href: "https://www.openai.com/"
      }
    ]
  }
}

export const appName = configApp.appName;
export const appLogo = configApp.appLogo;
export const pharosChainId = configApp.pharos.chainId;
export const pharosLogo = configApp.pharos.logo;
export const pharosRPC = configApp.pharos.rpc;
export const pharosExplorer = configApp.pharos.explorer;
export const linksGithub = configApp.links.github;
export const linksDocs = configApp.links.docs;
export const linksTwitter = configApp.links.twitter;
export const linksLogo = configApp.links.logo;
export const routes = configApp.routes;
export const brands = configApp.public.brands;
export const brandsCoinbase = configApp.public.brands[0];
export const brandsBinance = configApp.public.brands[1];
export const brandsKraken = configApp.public.brands[2];
export const brandsBitfinex = configApp.public.brands[3];
export const brandsBittrex = configApp.public.brands[4];
export const brandsOpenai = configApp.public.brands[5];
export const routesMobile = configApp.routesMobile;