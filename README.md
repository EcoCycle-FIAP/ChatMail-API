# Instruções para Rodar o Projeto
Este projeto é uma API desenvolvida com Node.js e OracleDB para funcionar como backend para o ChatMail App.

Para rodar o projeto localmente, siga os passos abaixo:

## 1. Instalar Dependências
Certifique-se de que você tem o Node.js e o npm (ou yarn) instalados em sua máquina. Se ainda não tiver, você pode instalar o Node.js a partir do site oficial.

No diretório do projeto, instale as dependências com o npm:
```
npm install
```

Ou, se estiver usando o yarn:

```
yarn install
```
## 2. Rodar o Servidor
Inicie o servidor com o comando:

```
npm start
```
Ou, se estiver usando o yarn:

```
yarn start
```

O servidor estará rodando em http://localhost:3000 por padrão.

## 3. Testar a API
Você pode testar a API utilizando ferramentas como Insomnia ou Postman. Certifique-se de que o servidor está rodando antes de fazer as requisições.
Abaixo exemplos básicos dos três principais tipos de requisição:

### 3.1. Listar Emails (GET)
```
http://localhost:3000/emails
```
### 3.2. Enviar Email (POST)
```
No Header:
http://localhost:3000/emails

No body:
{
    "senderEmailAddress": "sender@example.com",
    "recipientEmailAddress": "recipient@example.com",
    "subject": "Hello",
    "message": "This is a test email."
}
```
Obs.: no body podem ser passados outros parâmetros opcionais:senderFullName, recipientFullName, attachment, isFavorite.
### 3.3. Deletar Email (DELETE)
```
http://localhost:3000/emails/13
```
Obs.: o número após a barra representa o id do Email.

## 4. Encerrar o Servidor
Para parar o servidor, pressione Ctrl + C no terminal onde o servidor está rodando.
