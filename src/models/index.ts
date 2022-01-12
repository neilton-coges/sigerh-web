export type CdsFg = {
  id: string;
  tipo: string;
  simbologia: string;
  remuneracao: number;
  quantidadeVagas: number;
  quantidadeNomeados: number;
}

export interface IPage<T> {
  data: T[]; // elements
  perPage: number; // items per page
  size: number; // page size
  total: number; // total pages
  current: number; // current page
}
