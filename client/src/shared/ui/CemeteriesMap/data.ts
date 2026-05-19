export type CemeteryPoint = {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
};

export const MOSCOW_CEMETERIES: CemeteryPoint[] = [
  {
    id: "novodevichye",
    name: "Новодевичье кладбище",
    district: "Хамовники",
    lat: 55.7267,
    lng: 37.5561,
  },
  {
    id: "vagankovo",
    name: "Ваганьковское кладбище",
    district: "Пресня",
    lat: 55.7681,
    lng: 37.5714,
  },
  {
    id: "danilovskoye",
    name: "Даниловское кладбище",
    district: "Даниловский",
    lat: 55.7097,
    lng: 37.6286,
  },
  {
    id: "kalitnikovskoye",
    name: "Калитниковское кладбище",
    district: "Таганский",
    lat: 55.7347,
    lng: 37.6844,
  },
  {
    id: "rogozhskoye",
    name: "Рогожское кладбище",
    district: "Нижегородский",
    lat: 55.7375,
    lng: 37.6786,
  },
  {
    id: "perlovskoye",
    name: "Перловское кладбище",
    district: "Перово",
    lat: 55.7444,
    lng: 37.7586,
  },
  {
    id: "nikolo-arkhangelskoye",
    name: "Николо-Архангельское кладбище",
    district: "Новокосино",
    lat: 55.7583,
    lng: 37.8583,
  },
  {
    id: "mitinskoye",
    name: "Митинское кладбище",
    district: "Митино",
    lat: 55.8389,
    lng: 37.3553,
  },
  {
    id: "troekurovskoye",
    name: "Троекуровское кладбище",
    district: "Солнцево",
    lat: 55.6506,
    lng: 37.4244,
  },
  {
    id: "khovanskoye",
    name: "Хованское кладбище",
    district: "Солнцево",
    lat: 55.6292,
    lng: 37.47,
  },
];
