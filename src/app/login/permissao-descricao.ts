import { Permissao } from "./permissao";

export const PermissaoDescricoes: Record<Permissao, string> = {
    [Permissao.ARQUITETO]: 'Arquiteto (a)',
    [Permissao.CONSTRUTORA]: 'Construtora',
    [Permissao.DESIGN_INTERIORES]: 'Design de interiores',
    [Permissao.FORNECEDOR]: 'Fornecedor',
    [Permissao.ADMIN]: 'Adminstrador',
    [Permissao.CLIENTE]: 'Cliente'
};