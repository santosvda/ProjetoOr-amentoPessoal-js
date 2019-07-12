class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){
		for(let i in this){
			//notação patra acessar atributos de objetos
			if (this[i] == undefined || this[i] == '' || this[i] == null)  {
				return false
			}
		}
		return true
	}
}

class Bd{

	constructor(){
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id',0)
		}
	}

	getProximoId(){
		let proximoID = localStorage.getItem('id')
		console.log(parseInt(proximoID)+1)

		return parseInt(proximoID)+1
	}

	//grava as informações em local storage do navegador
	gravar(d){
		
		let id = this.getProximoId()

		//JSON.stringfy(d) = converte o objeto literal para uma notação JSON
		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros(){

		//array de despesas
		let despesas = []

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localstorage
		for(let i = 1; i<=id; i++){
			//recuperar a despesa
			//JSON.parse() = converte uma notação JSON em objeto literal
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver indices pulados ou removiddos
			//neste casos vamos pular estes indices
			if(despesa === null){
				continue
			}

			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa){
		let despesasfiltradas = Array()

		despesasfiltradas = this.recuperarTodosRegistros()

		//console.log(despesa)

		console.log(despesasfiltradas)


		//ano
		if (despesa.ano != '') {
			console.log('filtro de ano')
			despesasfiltradas = despesasfiltradas.filter(d => d.ano == despesa.ano)
		}
		//mes
		if (despesa.mes != '') {
			console.log('filtro de mes')
			despesasfiltradas = despesasfiltradas.filter(d => d.mes == despesa.mes)
		}
		//dia
		if (despesa.dia != '') {
			console.log('filtro de dia')
			despesasfiltradas = despesasfiltradas.filter(d => d.dia == despesa.dia)
		}
		//tipo
		if (despesa.tipo != '') {
			console.log('filtro de tipo')

			despesasfiltradas = despesasfiltradas.filter(d => d.tipo == despesa.tipo)
		}
		//descricao
		if (despesa.descricao != '') {
			console.log('filtro de descricao')

			despesasfiltradas = despesasfiltradas.filter(d => d.descricao == despesa.descricao)
		}
		//valor
		if (despesa.valor != '') {
			console.log('filtro de valor')
			despesasfiltradas = despesasfiltradas.filter(d => d.valor == despesa.valor)
		}
		console.log(despesasfiltradas)

		return despesasfiltradas
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function cadastrarDespesa(){

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	
	let despesa = new Despesa(
		ano.value,
		 mes.value, 
		 dia.value, 
		 tipo.value, 
		 descricao.value, 
		 valor.value
	)

	if(despesa.validarDados()){
		bd.gravar(despesa)
		//dialog de sucesso
		document.getElementById('texto-modal').className = 'modal-header text-success'
		document.getElementById('modal-h5').innerHTML = 'Sucesso ao gravar Registro'
		document.getElementById('modal-body').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('btn-modal').className = 'btn btn-success'
		document.getElementById('btn-modal').innerHTML = 'Voltar'
		$('#modalRegistraDespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''


	}
	else{
		//dialog de erro
		document.getElementById('texto-modal').className = 'modal-header text-danger'
		document.getElementById('modal-h5').innerHTML = 'Erro ao gravar Registro'
		document.getElementById('modal-body').innerHTML = 'Campos vazios ou inseridos de forma incorreta!'
		document.getElementById('btn-modal').className = 'btn btn-danger'
		document.getElementById('btn-modal').innerHTML = 'Voltar e corrigir'
		$('#modalRegistraDespesa').modal('show')

	}

	
}

//Vai ser chamada sempre que ocorrer o onload do body consuta.html
function carregaListaDespesas(despesas = [], filtro = false){

	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()
	}

	//console.log(despesas)

	//selecionaro o elemento tbody da tabela
	let listaDespesas =  document.getElementById('listaDespesas')
	listaDespesas.innerHTML = null

	/*
	<tr>
        <td>15/03/2018</td>
        <td>Alimentação</td>
        <td>Compras do mes</td>
        <td>R$ 2000</td>
    </tr>
    */

    //percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(d){


    	//criando a linha(tr)
    	let linha = listaDespesas.insertRow()

    	//criar as colunas(td)
    	linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

    	//ajustar o tipo
    	switch(d.tipo){
    		case '1': d.tipo = 'Alimentação'
    			break;
    		case '2': d.tipo = 'Educação'
    			break;
    		case '3': d.tipo = 'Lazer'
    			break;
    		case '4': d.tipo = 'Saúde'
    			break;
    		case '5': d.tipo = 'Transporte'
    			break;
    	}

    	linha.insertCell(1).innerHTML = d.tipo
    	
    	linha.insertCell(2).innerHTML = d.descricao
    	linha.insertCell(3).innerHTML = `R$ ${d.valor}`

    	//criar o botão de exclusão
    	let btn = document.createElement("button")
    	btn.className = 'btn btn-danger'
    	btn.innerHTML = '<i class="fas fa-times"></i>'
    	btn.id = `id_despesa_${d.id}`
    	btn.onclick = function(){
    		//remover a despesa
    		let id = this.id.replace('id_despesa_','')

    		bd.remover(id)

    		window.location.reload()
    	}
    	linha.insertCell(4).append(btn)

    	console.log(d)

    })
}

function pesquisaDespesa(){
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)


	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)

}




