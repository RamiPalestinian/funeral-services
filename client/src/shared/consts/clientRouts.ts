export const CLIENT_ROUTES = {
  HOME: "/home",
  PERSONAL: "/personal",
  GENERAL: "/",
  AI: "/ai",
  AUTH: "/auth",
  CLASSIC: "/classic",
  ISLAMIC: "/islamic",
  CREMATION: "/cremation",
  SHOP: "/shop",
  CONTACT: "/contact",
  CARD: "/card",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: "/checkout/success",
  TARAS_AND_YRA: "/tarasAndYra",
  NOT_FOUND: "*",
} as const;

export type ClientRoutePath =
  (typeof CLIENT_ROUTES)[keyof typeof CLIENT_ROUTES];

export function classicDetailRoute(id: number | string) {
  return `${CLIENT_ROUTES.CLASSIC}/${id}`;
}

export function islamicDetailRoute(id: number | string) {
  return `${CLIENT_ROUTES.ISLAMIC}/${id}`;
}

export function cremationDetailRoute(id: number | string) {
  return `${CLIENT_ROUTES.CREMATION}/${id}`;
}

export function shopDetailRoute(id: number | string) {
  return `${CLIENT_ROUTES.SHOP}/${id}`;
}

export function cardDetailRoute(id: number | string) {
  return `${CLIENT_ROUTES.CARD}/${id}`;
}
