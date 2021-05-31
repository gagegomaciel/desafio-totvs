const url = 'https://60afe4991f26610017ffd79f.mockapi.io/api/v1/clientes/';
const btnDetail = document.querySelector('#btn-detail');
const tableClient = document.querySelector("#table-client");
const titleTextAdd = document.querySelector('#text-title-add');
const itDoesNotHave = document.querySelector("#no-content");

const regex = {
  inputText: /[^a-zA-Zà-úÀ-Ú ]/g,
  inputUf: /[^a-zA-Z]/g,
  maskCnpj: /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
  clearCaracter: /[^0-9]+/g,
  cepFormat: /(\d{5})(\d{3})/
}

let listClient = [];
let confirmedDeletion;
let pickUpClinetId;
let editClient = false;
let updateRecordClientId;

function formatDate(data) {
  let dateInput = data;
  date = new Date(dateInput);
  formattedDate = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  return formattedDate;
}

let xhr = new XMLHttpRequest();
xhr.open("GET", url);
xhr.setRequestHeader("Content-type", "application/json");
xhr.addEventListener("load", function () {
  let response = xhr.responseText;
  let customers = JSON.parse(response);

  if (customers.length == 0) {
    itDoesNotHave.classList.remove('no-content-hiden');
  }

  customers.map((client) => {
    let trClientes = montaTr(client);
    tableClient.appendChild(trClientes);
    listClient.push(client);
  });
})
xhr.send();

function codeGenerator() {
  let numberCode = Math.floor(Math.random() * 9999);
  let generatedCode;

  if (listClient.length == 0) {
    generatedCode = numberCode;
  }

  listClient.map((client) => {
    if (client.codigo != numberCode) {
      generatedCode = numberCode;
    }
  });
  return generatedCode;
}

function insertCode() {
  $("#codigo").val(codeGenerator());
}

function closeModalInfo() {
  const modalAdd = document.querySelector("#modal-info-client");
  modalAdd.classList.remove('show');
}

function closeModal() {
  const modalAdd = document.querySelector("#modal-add-client");
  modalAdd.classList.remove('show');
}

function openCloseModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.getElementById('codigo').focus();
    modal.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.id == modalId
        || event.target.id == 'btn-close-modal'
        || event.target.id == 'btn-cancel-add'
        || event.target.id == 'btn-cancel'
        || event.target.id == 'btn-confirm-delete'
      ) {
        modal.classList.remove('show');
      }
    });
  }
  document.getElementById("nome").focus();
}

function showDetailClient() {
  $(document).on("click", "#btn-detail", function () {
    let pickUpClientId = $(this).parent().parent().find("#codigoId").text();

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET'
    }).then(response => response.json())
      .then(clientes => {
        clientes.map((cliente) => {
          if (pickUpClientId === cliente.Id) {
            fillInCustomerData(cliente);
          }
        });
      });
    openCloseModal('modal-details');
  });
}

function fillInCustomerData(cliente) {
  let cnpj = cliente.cnpj;
  let cnpjValidated = cnpj.replace(regex.maskCnpj, "$1.$2.$3/$4-$5");
  let cep = cliente.cep;
  let cepValidated = cep.replace(regex.cepFormat, "$1-$2");

  $("#codigoCliente").val(cliente.codigo);
  $("#nameClient").val(cliente.nome);
  $("#fantasiaClient").val(cliente.nome_fantasia);
  $("#cepClient").val(cepValidated);
  $("#adrressClient").val(cliente.endereco);
  $("#districtClient").val(cliente.bairro);
  $("#localityClient").val(cliente.localidade);
  $("#ufClient").val(cliente.uf);
  $("#cnpjClient").val(cnpjValidated);
  $("#dateClient").val(formatDate(cliente.data));
}

function EditRecordClient() {
  $(document).on("click", "#btn-edit", function () {
    let pickUpClientId = $(this).parent().parent().find("#codigoId").text();

    editClient = true;

    updateRecordClientId = pickUpClientId;

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET'
    }).then(response => response.json())
      .then(clientes => {
        clientes.map((client) => {
          if (pickUpClientId === client.Id) {
            fillInDataForEditing(client);
          }
        });
      });
    openCloseModal('modal-add-client');
    titleTextAdd.textContent = "Editar Registro do Cliente.";
  });
}

function fillInDataForEditing(client) {
  let cnpjEdit = client.cnpj;
  let cnpjValidatedEdit = cnpjEdit.replace(regex.maskCnpj, "$1.$2.$3/$4-$5");
  let cepEdit = client.cep;
  let cepValidatedEdit = cepEdit.replace(regex.cepFormat, "$1-$2");

  $("#codigo").val(client.codigo);
  $("#nome").val(client.nome);
  $("#fantasia").val(client.nome_fantasia);
  $("#cep").val(cepValidatedEdit);
  $("#endereco").val(client.endereco);
  $("#bairro").val(client.bairro);
  $("#localidade").val(client.localidade);
  $("#uf").val(client.uf);
  $("#cnpj").val(cnpjValidatedEdit);
  document.getElementById("endereco").disabled = true;
  document.getElementById("bairro").disabled = true;
  document.getElementById("localidade").disabled = true;
  document.getElementById("uf").disabled = true;
  document.getElementById("cnpj").disabled = true;
}

function montaTr(cliente) {
  let trCliente = document.createElement("tr");
  let tdConfig = document.createElement("td");
  let btnEdit = document.createElement("button");
  let btnDelete = document.createElement("button");
  let btnDetail = document.createElement("button");

  trCliente.appendChild(montaTd(cliente.Id, 'hiden-colum', 'codigoId'));
  trCliente.appendChild(montaTd(cliente.codigo));
  trCliente.appendChild(montaTd(cliente.nome));
  trCliente.appendChild(montaTd(cliente.nome_fantasia));
  trCliente.appendChild(montaTd(cliente.localidade));
  trCliente.appendChild(montaTd(formatDate(cliente.data)));
  trCliente.appendChild(montaTd(cliente.cnpj.replace(regex.maskCnpj, "$1.$2.$3/$4-$5")));

  tdConfig.appendChild(btnEdit);
  trCliente.appendChild(tdConfig);
  tdConfig.classList.add("table-config");
  btnEdit.innerHTML = "Editar";
  btnEdit.classList.add("btn", "btn-sm", "btn-secondary");
  btnEdit.setAttribute('id', 'btn-edit');
  btnEdit.setAttribute('onClick', 'EditRecordClient()');

  tdConfig.appendChild(btnDelete);
  trCliente.appendChild(tdConfig);
  tdConfig.classList.add("table-config");
  btnDelete.innerHTML = "Deletar";
  btnDelete.classList.add("btn", "btn-sm", "btn-danger", "btn-space");
  btnDelete.setAttribute('id', 'btn-delete');
  btnDelete.setAttribute('onClick', 'removeClient()');

  tdConfig.appendChild(btnDetail);
  trCliente.appendChild(tdConfig);
  tdConfig.classList.add("table-config");
  btnDetail.innerHTML = "Detalhes";
  btnDetail.classList.add("btn", "btn-sm", "btn-info", "btn-space");
  btnDetail.setAttribute('id', 'btn-detail');
  btnDetail.setAttribute('onClick', 'showDetailClient()');

  return trCliente;
}

function montaTd(dado, classe, atribuit) {
  let td = document.createElement("td");
  td.setAttribute('id', atribuit);
  td.textContent = dado;
  td.classList.add(classe);
  return td;
}

function removeClient() {
  $(document).on("click", "#btn-delete", function () {
    pickUpClinetId = $(this).parent().parent().find("#codigoId").text();
    showConfirmacao();
  });
}

$(document).on("click", "#btn-confirm-delete", function () {
  confirmedDeletion = true;
  deletedRecord(confirmedDeletion);
});

function deletedRecord(confirmation) {
  if (confirmation) {
    fetch(url + pickUpClinetId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.ok) {
        openCloseModal('modal-success-client');
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      } else {
        console.error(response.status);
        openCloseModal('modal-error-client');
      }
    });
  }
}

function showModalAddClient() {
  openCloseModal('modal-add-client');
  insertCode();
  titleTextAdd.textContent = "Cadastrar Novo Cliente";
}

function showConfirmacao() {
  openCloseModal('modal-confirmacao-client');
}

let btnSave = document.querySelector("#btn-save");
btnSave.addEventListener('click', function (event) {
  event.preventDefault();
  const form = document.querySelector('#form-dados');
  dataProcessing(form);
});

function dataProcessing(form) {
  let cnpjClient = form.cnpj.value;
  let cnpjValue = cnpjClient.replace(regex.clearCaracter, "");
  let cepClient = form.cep.value;
  let cepValidated = cepClient.replace(regex.clearCaracter, "");

  let validatedData = validateFields(form);
  let duplicateDataChecked = checksForDuplicateData(cnpjValue);

  let codigo = form.codigo.value;
  let nome = form.nome.value;
  let nomeFantasia = form.fantasia.value;
  let cep = cepValidated;
  let endereco = form.endereco.value;
  let bairro = form.bairro.value;
  let localidade = form.localidade.value;
  let uf = form.uf.value;
  let data = new Date();
  let cnpj = cnpjValue;

  const request_object = {
    codigo,
    nome,
    nome_fantasia: nomeFantasia,
    cep,
    endereco,
    bairro,
    localidade,
    uf,
    data,
    cnpj
  }

  if (validatedData) {
    if (editClient) {
      updateClient(request_object, updateRecordClientId);
    } else if (!duplicateDataChecked) {
      saveClient(request_object);
    } else {
      openCloseModal('modal-info-client');
      setTimeout(function () {
        closeModalInfo();
      }, 3000);
    }
  } else {
    form.classList.add('was-validated');
  }
}

function validateFields(form) {
  let validated = true;

  if (!form.nome.value) {
    validated = false;
  }
  if (!form.fantasia.value) {
    validated = false;
  }
  if (!form.cep.value) {
    validated = false;
  }
  if (!form.endereco.value) {
    validated = false;
  }
  if (!form.bairro.value) {
    validated = false;
  }
  if (!form.localidade.value) {
    validated = false;
  }
  if (!form.localidade.value) {
    validated = false;
  }
  if (!form.uf.value) {
    validated = false;
  }
  if (!form.cnpj.value) {
    validated = false;
  }

  if (validated) {
    return true;
  } else {
    return false;
  }
}

function checksForDuplicateData(cnpj) {
  let cnpjExist = false;
  listClient.map(client => {
    if (client.cnpj == cnpj) {
      cnpjExist = true;
    }
  });

  return cnpjExist;
}

function saveClient(bodyRequest) {
  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyRequest),
  }).then(response => {
    if (response.ok) {
      closeModal();
      openCloseModal('modal-success-client');
      setTimeout(function () {
        window.location.reload();
      }, 3000);
    } else {
      openCloseModal('modal-error-client');
      console.error(response.status);
    }
  });
}

function updateClient(bodyRequest, id) {
  fetch(url + id, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyRequest),
  }).then(response => {
    if (response.ok) {
      closeModal();
      openCloseModal('modal-success-client');
      setTimeout(function () {
        window.location.reload();
      }, 3000);
    } else {
      openCloseModal('modal-error-client');
      console.error(response.status);
    }
  });
}

$(document).ready(function () {
  $("#nome").on("input", function () {
    if (this.value.match(regex.inputText)) {
      $(this).val(this.value.replace(regex.inputText, ''));
    }
  });
  $("#fantasia").on("input", function () {
    if (this.value.match(regex.inputText)) {
      $(this).val(this.value.replace(regex.inputText, ''));
    }
  });
  $('#cep').mask('00000-000');
  $("#bairro").on("input", function () {
    if (this.value.match(regex.inputText)) {
      $(this).val(this.value.replace(regex.inputText, ''));
    }
  });
  $("#localidade").on("input", function () {
    if (this.value.match(regex.inputText)) {
      $(this).val(this.value.replace(regex.inputText, ''));
    }
  });
  $("#uf").on("input", function () {
    if (this.value.match(regex.inputUf)) {
      $(this).val(this.value.replace(regex.inputUf, ''));
    }
  }).mask('AA');
  $('#cnpj').mask('00.000.000/0000-00');
  $('#cnpjClient').mask('00.000.000/0000-00');
});

$("#cep").focusout(function () {
  let cep = $("#cep").val();
  let cepValue = cep.replace("-", "");

  fetch(`https://viacep.com.br/ws/${cepValue}/json/`, {
    method: 'GET',
  }).then(response => response.json())
    .then(cep => {
      fillInAddress(cep);
    });
});

function fillInAddress(endereco) {
  $("#endereco").val(endereco.logradouro);
  $("#bairro").val(endereco.bairro);
  $("#localidade").val(endereco.localidade);
  $("#uf").val(endereco.uf);
  document.getElementById("endereco").disabled = true;
  document.getElementById("bairro").disabled = true;
  document.getElementById("localidade").disabled = true;
  document.getElementById("uf").disabled = true;
  document.getElementById("cnpj").focus();
}

function cleanFields() {
  $("#nome").val('');
  $("#fantasia").val('');
  $("#cep").val('');
  $("#endreco").val('');
  $("#bairro").val('');
  $("#localidade").val('');
  $("#uf").val('');
  $("#cnpj").val('');
  document.getElementById("endereco").disabled = false;
  document.getElementById("bairro").disabled = false;
  document.getElementById("localidade").disabled = false;
  document.getElementById("uf").disabled = false;
  document.getElementById("cnpj").disabled = false;
}