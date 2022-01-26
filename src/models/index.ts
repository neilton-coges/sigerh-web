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
  descricao: string;
  horas: JornadaHora[];
}

export type Unidade = {
  id: string;
  sigla: string;
  unidadePaiId: string;
  subUnidades: Unidade[];
}

export type Usuario = {
  id: string;
  login: string;
  senha: string;
  tipo: string;
  servidorId: string;
}

export type Servidor = {
  id: string;
  nome: string;
  dataNascimento: string;
  telefoneCorporativo: string;
  telefonePessoal: string;
  emailCorporativo: string;
  emailPessoal: string;
  genero: string;
  tipoSanguineo: string;
  corRaca: string;
  nacionalidade: string;
  naturalidadeCidade: string;
  naturalidadeEstado: string;
  estadoCivil: string;
  conjugeNome: string;
  conjugeCpf: string;
  conjugeDataNascimento: string;
  nomePai: string;
  nomeMae: string;
  cpf: string;
  rgNumero: string;
  rgOrgaoEmissor: string;
  rgDataEmissao: string;
  tituloNumero: string;
  tituloSecao: string;
  tituloZona: string;
  pis: string;
}

export type Lotacao = {
  id: string;
  matricula: string;
  dataAdmissao: Date;
  observacao: string;
  servidorId: string;
  cargoId: string;
  cdsFgId: string;
  unidadeId: string;
  subUnidadeId: string;
  jornadaId: string;
  cargo: Cargo;
  cdsFg: CdsFg;
  unidade: Unidade;
  subUnidade: Unidade;
  jornada: Jornada;
}

export interface IPage<T> {
  data: T[]; // elements
  perPage: number; // items per page
  size: number; // page size
  total: number; // total pages
  current: number; // current page
}
