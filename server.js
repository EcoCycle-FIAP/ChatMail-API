const express = require('express');
const oracledb = require('oracledb');
const db = require('./config/db');
const app = express();
const port = 3000;

async function closeConnection(connection) {
    if (connection) {
        try {
            await connection.close();
        } catch (error) {
            console.error('Erro ao fechar a conexão com o banco de dados', error);
        }
    }
};

app.use(express.json());

// Endpoint para listar emails
app.get('/emails', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            'SELECT * FROM TBL_EMAILS',
            [], // Parâmetros se houver
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        // Mapeia os dados para uma estrutura JSON simples
        const emails = result.rows.map(row => ({
            senderEmailAddress: row.SENDER_EMAIL_ADDRESS,
            senderFullName: row.SENDER_FULL_NAME,
            recipientEmailAddress: row.RECIPIENT_EMAIL_ADDRESS,
            recipientFullName: row.RECIPIENT_FULL_NAME,
            subject: row.SUBJECT,
            message: row.MESSAGE,
            attachment: row.ATTACHMENT,
            isFavorite: row.IS_FAVORITE,
            sendedDate: row.SENDED_DATE
        }));

        res.json(emails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await closeConnection();
    }
});

// Endpoint para enviar emails
app.post('/emails', async (req, res) => {
    let connection;

    // Captura os dados do email a partir do corpo da requisição (req.body)
    const {
        senderEmailAddress,
        senderFullName,
        recipientEmailAddress,
        recipientFullName,
        subject,
        message,
        attachment,
        isFavorite = "N"
    } = req.body;

    try {
        connection = await oracledb.getConnection();

        // Query de inserção no banco de dados
        const result = await connection.execute(
            `INSERT INTO TBL_EMAILS (
                sender_email_address, sender_full_name, 
                recipient_email_address, recipient_full_name, 
                subject, message, attachment, is_favorite, sended_date
            ) VALUES (
                :senderEmailAddress, :senderFullName, 
                :recipientEmailAddress, :recipientFullName, 
                :subject, :message, :attachment, :isFavorite, 
                CURRENT_TIMESTAMP
            )`,
            {
                senderEmailAddress,
                senderFullName,
                recipientEmailAddress,
                recipientFullName,
                subject,
                message,
                attachment,
                isFavorite
            },
            { autoCommit: true } // Garante que a transação será commitada
        );

        // Responde com o ID gerado do email inserido
        res.status(201).json({
            message: 'Email inserido com sucesso!',
            emailId: result.lastRowid
        });
    } catch (error) {
        console.error('Erro ao inserir email', error);
        res.status(500).json({ error: 'Erro ao inserir email' });
    } finally {
        await closeConnection();

    }
});

// Endpoint para deletar um email pelo ID
app.delete('/emails/:id', async (req, res) => {
    let connection;
    const { id } = req.params; // Obtém o ID da URL

    try {
        connection = await oracledb.getConnection();

        // Query para deletar o email baseado no ID
        const result = await connection.execute(
            `DELETE FROM TBL_EMAILS WHERE email_id = :id`,
            [id],
            { autoCommit: true } // Garante que a transação será commitada
        );

        if (result.rowsAffected > 0) {
            res.status(200).json({ message: 'Email deletado com sucesso!' });
        } else {
            res.status(404).json({ message: 'Email não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao deletar email', error);
        res.status(500).json({ error: 'Erro ao deletar email' });
    } finally {
        await closeConnection(connection);
    }
});

// Inicializar o servidor e a conexão ao banco
app.listen(port, async () => {
  await db.initialize();
  console.log(`API running on http://localhost:${port}`);
});

// Encerrar a conexão ao fechar o servidor
process.on('SIGINT', async () => {
  await db.close();
  process.exit(0);
});
