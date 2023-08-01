const express = require('express');
const app = express();
const port = 3001; // você pode escolher outra porta se preferir

var produtos = new Array();

app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

//Exemplo de rota básica
app.get('/api/produto', (resq, res)=> {

    res.send(produtos);
});

app.get('/api/produto/:id' , (req, res) => {
    
    const produtoId = parseInt(req.params.id);  
    const produtoIndex = produtos.findIndex((produto)=> produto.id === produtoId);    

    if (produtoIndex !== -1) {
        res.send(produtos[produtoIndex]);
    } else {
        res.status(404).send('Produto não encontrado');
    }
});

//Rota usuário
app.post('/api/produto', (req, res) => {

    const {id, nome, email} = req.body;

    produtos.push({id:id, nome:nome, email:email});

    // Salvar usuário em banco de dados, retornar dados do usário recebidos na requisição
    res.send("produto cadastrado com sucesso");


});

//Rota para excluir um produto por ID
app.delete('/api/produto/:id' , (req, res) => {

    const produtoId = parseInt(req.params.id);  
    const produtoIndex = produtos.findIndex((produto)=> produto.id === produtoId);    

    if (produtoIndex !== -1) {
        produtos.splice(produtoIndex, 1);
        res.send('Produto excluído com sucesso!');
    } else {
        res.status(404).send('Produto não encontrado');
    }
});

//rota para atualizar um produto por ID
app.put('/api/produto', (req, res)=>{

    const produtoId = parseInt(req.body.id);
    const {nome, email} = req.body;

    const produtoIndex = produtos.findIndex((produto)=> produto.id ===produtoId);

    if (produtoIndex !== -1) {
        //atualizar os dados do produto
        produtos[produtoIndex].nome = nome;
        produtos[produtoIndex].email=email;
        res.send('Produto atualizado com sucesso!');
    } else {
        res.status(404).send('Produto não encontrado');
    }
}); 

//endpoint para buscar produto pelo ID.
app.get('/api/produto/:id', (req, res) => {
    const produtoId = parseInt(req.params.id);

    console.log(produtoId);
    const produto = produtos.find((produto) => produto.id === produtoId);

    if(!produto) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    res.json(produto);
})


//Iniciar o servidor
app.listen(port,()=> {
    console.log(`Servidor rodando na porta ${port}`);
});