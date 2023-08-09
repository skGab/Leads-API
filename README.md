<!-- TITLE -->
<h1 align="center" color="black">Leads Api</h1>

<!-- THUMB -->
<p align="center">
        <img src="./static/doc_thumb.png" width="250" alt="Logo do Projeto" object-fit="cover">
</p>

<!-- STATUS -->
<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/zDeep10/Leads-API.svg)](https://github.com/zDeep10/Leads-API/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/zDeep10/Leads-API.svg)](https://github.com/zDeep10/Leads-API/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<!-- DESCRIPTION -->
<p align="center"> 
        💡 
        A Leads API é um servidor Node.js construído com TypeScript e Fastify para lidar com leads do RD Station e armazená-los no Google BigQuery.
  <br> 
</p>

<!-- INTRO -->

## Índice

- [Tecnologias](#technologies)
- [Objetivo](#goal)
- [Funcionalidades](#features)
- [Requerimentos de qualidade](#quality)
- [Instruções de Uso](#glossary)
- [Autor](#authors)

## Tecnologias <a name="technologies"></a>

- Node.Js
- Typescript
- Fastify
- Zod (Validações)
- Winston (Tratando Erros)

## Objetivo <a name="goal"></a>

O objetivo da Leads API é receber dados via webhook da plataforma RD Station e executar os devidos tratamentos, incluindo a verificação de tipos de dados, a criação de tabelas e a inserção desses dados no Google BigQuery. Essa abordagem permite a coleta e organização eficiente dos leads, possibilitando análises detalhadas por meio das funcionalidades do Google Console. Através dessas análises, a equipe de marketing e vendas poderá obter insights valiosos para aprimorar suas estratégias, tomar decisões embasadas em dados e otimizar o desempenho geral do processo de geração de leads e conversão de clientes.

## Funcionalidades <a name="features"></a>

- Recebimento de dados via Webhook
- Atualização de dados no Bigquery
- Inserção de dados no bigquery
- Criação de tabelas
- Categorização de Leads (Leads novos && Leads para atualização)
- Remoção de Leads duplicados
- Filtra os campos principais dos dados

## Requerimentos de qualidade <a name="quality"></a>

- Performance
- Sustentável
- Disponibilidade 24/7
- Escalavel

## Instruções de Uso <a name="glossary"></a>

- Pela arquitetura atual do projeto será necessario fazer as devidas modificações na pasta "helpers", la se encontra implementações que estão mais voltadas  para a API do Google - Big Query. 

- Certifique-se de ter o Node.js instalado em seu sistema, clone o repositorio e em seguida execute o comando para instalar as dependências do projeto.:

`npm install`

<br>

- Para iniciar o servidor de desenvolvimento local, utilize o seguinte comando:

`npm run dev`

O sistema estará disponível em http://localhost:5000/. As alterações no código serão recarregadas automaticamente no console.

<br>

- Para criar a versão final do projeto otimizada para produção, execute o seguinte comando:

`npm run build`

Os arquivos finais serão gerados na pasta 'dist'.

<br>

Após o build, para iniciar a aplicação puxando o arquivo de dentro da pasta "dist", rodamos o comando:

`npm run start`

- O projeto utiliza ESLint para análise estática do código e Prettier para formatação. Verifique problemas de linting ou formate o código automaticamente com os seguintes comandos:

`npm run lint`

`npm run format `

## Autor <a name="authors"></a>

- [@Gabriel Assunção](https://github.com/zDeep10) - Ideia e Construção.
