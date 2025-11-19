# Ideia Raw: Autenticação Alternativa com Email e Senha

## Descrição do Usuário

Alguns usuários estão reclamando que o login do X não funciona, quero dar uma alternativa rápida pra eles como um cadastro de usuário, nome, e-mail e senha para entrar. Só que o sistema está todo voltado pra informações que veem do X, seguindo arquivo MD anexado, planeja algo e me sugira opções, fáceis, seguras e sem muito transtorno na configuração e execução. sem ter que usar SMTP ou coisa parecida.

## Contexto Técnico

- Sistema atual usa NextAuth.js com autenticação via X (Twitter) OAuth
- Modelo User no Prisma tem `xId` como campo obrigatório e único
- Sistema está totalmente voltado para informações do X
- Usuários precisam de alternativa quando login do X falha
- Requisitos: fácil, seguro, sem SMTP, sem muito transtorno

## Data de Criação

2025-01-27

