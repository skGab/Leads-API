export interface Auth {
  keyFilename: string;
  projectId: string;
}

export interface Cliente {
  [key: string]: string;
}
export interface Clientes {
  leads: Cliente[];
}
