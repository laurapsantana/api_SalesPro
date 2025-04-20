# API SalesPro
API de Gerenciamento de Vendas
Esta API foi desenvolvida em Node.js com Express e conecta-se a um banco de dados PostgreSQL. Ela fornece endpoints para análise de vendas, produtos e clientes, permitindo o suporte a um aplicativo Flutter que exibe gráficos interativos e relatórios detalhados.

## Descrição do Projeto
A API tem como objetivo fornecer dados confiáveis e estruturados para o gerenciamento eficiente de vendas. Os endpoints permitem realizar consultas específicas e filtradas, como:
Produtos mais vendidos.
Clientes que mais compraram.
Desempenho por região.
Análises de vendas mensais.

## A API também implementa boas práticas, como:
Utilização de variáveis de ambiente para configuração.
Validação de dados.
Estrutura modular para manutenção e escalabilidade.

## Funcionalidades Principais
- Produtos:
Retorna os produtos mais vendidos e menos vendidos por período.
Consulta detalhada de produtos.
- Clientes:
Lista os clientes que mais compraram no período.
Busca clientes frequentes e detalhes específicos por ID.
- Vendas:
Análises detalhadas por mês, região e cidade.
Gráficos de desempenho de vendas.

## Filtros Dinâmicos:
Suporte a filtros por períodos, regiões e categorias.

## Tecnologias Utilizadas
- Node.js	Plataforma principal para o backend.
- Express	Framework para criação de rotas e middlewares.
- PostgreSQL	Banco de dados relacional para armazenamento.
- dotenv	Gerenciamento de variáveis de ambiente.
- pg	Driver para comunicação com o PostgreSQL.

## Passo a Passo para Configuração
- Clone o Repositório
git clone <https://github.com/laurapsantana/api_SalesPro>
- Instale as Dependências
- Acesse a pasta do projeto e instale os pacotes necessários:
cd backend
npm install
- Configure as Variáveis de Ambiente
- Crie um arquivo .env na raiz do projeto e configure as variáveis:
- Execute o Servidor
- Inicie o servidor Node.js:
- npm start

## Estrutura do Projeto
- backend/
- ├── routes/            # Rotas da API
- ├── models/            # Definição de modelos de dados
- ├── controllers/       # Lógica de controle das rotas
- ├── database/          # Conexão com o banco de dados
- ├── app.js             # Configuração principal do app
- └── .env.example       # Exemplo de arquivo de variáveis de ambiente


