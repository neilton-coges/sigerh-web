export type CdsFg = {
  id: string;
  tipo: string;
  simbologia: string;
  remuneracao: number;
  quantidadeVagas: number;
  quantidadeNomeados: number;
}

export type NivelCargo = {
  id: string;
  codigo: string;
  descricao: string;
}

export type ClasseNivelCargo = {
  id: string;
  codigo: string;
  descricao: string;
}

export type PadraoClasseNivelCargo = {
  id: string;
  codigo: string;
  descricao: string;
  valor: number;
  valorReajustado: number;
}

export type ReajusteClasseNivelCargo = {
  id: string;
  percentual: number;
  observacao: string;
}

export interface IPage<T> {
  data: T[]; // elements
  perPage: number; // items per page
  size: number; // page size
  total: number; // total pages
  current: number; // current page
}
