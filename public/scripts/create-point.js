// Seleção do estado e da cidade
function populateUFs() {
  const ufSelect = document.querySelector("select[name=uf]")
  
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
  .then( res => res.json() )
  .then( states => {
    
    for( state of states ) {
      ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
    }
  
  })
}

populateUFs()

function getCities(event) {
  const citySelect = document.querySelector("[name=city]")
  const stateInput = document.querySelector("[name=state]")

  const ufValue = event.target.value

  const indexOfSelectedState = event.target.selectedIndex
  stateInput.value = event.target.options[indexOfSelectedState].text  

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

  citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
  citySelect.disabled = true

  fetch(url)
  .then( res => res.json() )
  .then( cities => {
    
    for( city of cities ) {
      citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
    }
  
      citySelect.disabled = false
  })
}

document
  .querySelector("select[name=uf]")
  .addEventListener("change", getCities)
 
// Itens de Coleta

const itemsToCollect = document.querySelectorAll(".items-grid li")

// Criar a classe selected para mudar a estilização quando o usuário selecionar o item
for ( item of itemsToCollect ) {
  item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]") 

let selectedItems = []

function handleSelectedItem(event) {
  const itemLi = event.target

  // Adicionar ou remover uma classe com JavaScript
  itemLi.classList.toggle("selected")

  const itemId = itemLi.dataset.id  

  // Verificar se existem itens selecionados, se sim pegar os ítens selecionados
  const alreadySelected = selectedItems.findIndex( item => {
    const itemFound =  item == itemId
    return itemFound
  })

  // Se já estiver selecionado, tirar da seleção
  if(alreadySelected >= 0) {
    const filterAddItems = selectedItems.filter( item => {
      const itemIsDifferent = item != itemId
      return false
    })
    
    selectedItems = filterAddItems
  }else{
    // Se não estiver selecionado, adicionar o elemento no array 
    selectedItems.push(itemId)
  }
  console.log(selectedItems)

  // Atualivar o input escondido com os dados selecionados
  collectedItems.value = selectedItems

}