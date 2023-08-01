const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sCodigo = document.querySelector('#m-codigo')
const sNome = document.querySelector('#m-nome')
const sEmail = document.querySelector('#m-email')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id
let editar = false;

let httpRequest; 

function makeHttpRequest() {
  if (window.XMLHttpRequest) { // Mozilla, Safari, ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 8 and older
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }
}

function openModal(edit = false, index = 0) {
    modal.classList.add('active')
  
    modal.onclick = e => {
      if (e.target.className.indexOf('modal-container') !== -1) {
        modal.classList.remove('active')
      }
    }
  
    editar = edit;
    const sCodigo = document.querySelector('#m-codigo');

    if (edit) {
      resquestItemById(index);
      //  sCodigo.value = itens[index].codigo
      //  sNome.value = itens[index].nome
      //  sEmail.value = itens[index].email
       id = index

       // Para bloquear o campo
       sCodigo.readOnly = true;
      
    } else {
      sCodigo.value = ''
      sNome.value = ''
      sEmail.value = ''
      // Para bloquear o campo
      sCodigo.readOnly = false;
    }
    
  }

   //TODO: Fazer o request de produto por id

  function resquestItemById(id) {
    makeHttpRequest();
    const produtoId = parseInt(id);
    httpRequest.open('GET', `http://localhost:3001/api/produto/${produtoId}`, true);
    httpRequest.send(null);

    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          let item = JSON.parse(httpRequest.responseText);

          sCodigo.value = item.id;
          sNome.value = item.nome;
          sEmail.value = item.email;
        } else {
          alert('Houve um problema ao buscar o produto por ID;')
        }
      }
    };
  }
  
  function editItem(index) {
    openModal(true, index)
  }
  
  function deleteItem(index) {
    itens.splice(index, 1)
    setItensBD()
    loadItens()
  }
  
  function insertItem(item, index) {
    let tr = document.createElement('tr')

    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nome}</td>
      <td> ${item.email}</td>
      <td class="acao">
        <button onclick="editItem(${item.id})"><i class='bx bx-edit' ></i></button>
      </td>
      <td class="acao">
        <button onclick="deleteItem(${item.id})"><i class='bx bx-trash'></i></button>
      </td>
    `
    tbody.appendChild(tr)
   
  }
  
  btnSalvar.onclick = e => {
    
    if (sCodigo.value == '' || sNome.value == '' || sEmail.value == '') {
      return
    }
  
    e.preventDefault();
    const produtoId = parseInt(sCodigo.value);
    
    var data = {
      id: produtoId,
      nome: sNome.value,
      email: sEmail.value
    };

    if(!editar)
      postItens(data);
    else
      putItens(data);
  
    modal.classList.remove('active')
    loadItens()
    id = undefined
  }
  
  function loadItens() {

    makeHttpRequest();
    httpRequest.open('GET', 'http://localhost:3001/api/produto', true);
    httpRequest.send(null);

    httpRequest.onreadystatechange = function(data) {

      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          let obj = JSON.parse(httpRequest.responseText);

          tbody.innerHTML = ''

          obj.forEach((item, index) => {
              insertItem(item, index)
           })  

        } else {
          alert('There was a problem with the request.');
        }
      }
    };
  }

  function postItens(produto) {
  
    makeHttpRequest();

    httpRequest.open('POST', 'http://localhost:3001/api/produto', true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState ===4) {
        if (httpRequest.status === 200) {
          alert('POST request was successful');

          loadItens();
        } else {
          alert('POST resquest failed');
        }
      }
    }
    
    httpRequest.send(JSON.stringify(produto));
  }

  function putItens(produto) {
  
    makeHttpRequest();

    httpRequest.open('PUT', 'http://localhost:3001/api/produto', true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          alert('POST request was successful');

          loadItens();
        } else {
          alert('POST resquest failed');
        }
      }
    }
    
    httpRequest.send(JSON.stringify(produto));
  }

  function deleteItem(id) {
    makeHttpRequest();
    httpRequest.open('DELETE', `http:localhost:3001/api/produto/${id}`, true);
    httpRequest.onreadystatechange = function() {
      if(httpRequest.readyState === 4) {
        if(httpRequest.status === 200) {
          alert('DELETE resquest was successful');
          loadItens();
        } else {
          alert('DELETE resquest failed');
        }
      }
    };
    httpRequest.send(null);
  }
  
  const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
  const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))
  
  loadItens()