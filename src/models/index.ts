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

export type Cargo = {
  id: string;
  tipo: string;
  descricao: string;
  nivelCargoId: string;
}

export type JornadaHora = {
  id: string;
  horaInicio: string;
  horaFim: string;
}

export type Jornada = {
  id: string;
  nome: string;
  horas: JornadaHora[];
}

export type Unidade = {
  id: string;
  sigla: string;
  unidadePaiId: string;
  subUnidades: Unidade[];
}

export interface IPage<T> {
  data: T[]; // elements
  perPage: number; // items per page
  size: number; // page size
  total: number; // total pages
  current: number; // current page
}
