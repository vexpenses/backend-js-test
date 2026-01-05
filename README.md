# Backend Test Project (NestJS)

## Introdução

Este é um projeto de um **SaaS de Pagamentos** onde empresas são clientes da plataforma e gerenciam recursos financeiros para seus colaboradores.

Neste sistema:
- **Empresas** se cadastram como clientes da plataforma e provisionam recursos financeiros
- **Colaboradores** são usuários vinculados às empresas que possuem contas e cartões
- Os colaboradores utilizam a solução para realizar pagamentos através de suas contas e cartões
- A plataforma se integra com um serviço bancário externo para gerenciar contas e cartões

## Sobre o Teste

Este projeto foi criado para avaliar suas habilidades de análise de código, identificação de problemas e senso crítico em relação a qualidade de software.

## Instruções para o Candidato

### Objetivo

Você deve analisar este repositório em busca de **inconsistências, bugs, vulnerabilidades de segurança e problemas de qualidade de código**. Após a análise, prepare um relatório detalhado com suas descobertas.

### O que deve conter no relatório:

Para cada problema identificado, você deve documentar:

1. **O que foi encontrado**: Descrição clara do problema
2. **Localização**: Arquivo e linha(s) de código onde o problema está
3. **Por que isso é um problema**: Explique o impacto, riscos e consequências
4. **Como resolver**: Sua proposta de solução para corrigir o problema
5. **Severidade**: Classifique como Crítica, Alta, Média ou Baixa

### 🎁 Bônus (Opcional)

Além de identificar problemas, **liste no relatório** melhorias gerais que você sugere para que este projeto se torne mais robusto, escalável e alinhado com as melhores práticas.

**Importante**: Não precisa implementar nada, apenas **descrever as sugestões de melhoria** no relatório.

**Esta seção demonstra sua visão técnica e capacidade de pensar além da correção de bugs!**

### Regras Importantes

⚠️ **NÃO faça fork deste repositório**

⚠️ **NÃO envie pull requests**

✅ **Você PODE clonar o repositório localmente para análise**

### Formato do Relatório

Você pode entregar o relatório no formato que preferir:
- Documento Markdown (.md)
- PDF
- Google Docs

O importante é que seja claro, organizado e demonstre seu raciocínio técnico.

### Entrega

Envie seu relatório por e-mail conforme instruções recebidas no processo seletivo.

---

## Setup do Projeto (para análise local)

### Pré-requisitos

- Node.js 16+
- PostgreSQL/MySQL
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
# (crie um banco PostgreSQL/MySQL e configure as variáveis de ambiente)

# Rodar migrations (se houver)
npm run migration:run

# Iniciar o servidor
npm run start:dev
```

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e
```

---

**Boa sorte! 🚀**
