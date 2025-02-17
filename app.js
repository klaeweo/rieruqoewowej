// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert")
const form  = document.querySelector(".grocery-form")
const grocery = document.getElementById("grocery")
const submitBtn = document.querySelector(".submit-btn")
const container = document.querySelector(".grocery-container")
const list      = document.querySelector(".grocery-list")
const clearBtn  = document.querySelector(".clear-btn")
const currentWeek  = document.querySelector(".week")
const currentDay   = document.querySelector(".date")
const currentMonth = document.querySelector(".month")

// edit option
let editElement;
let editFlag = false;
let editID = ''
// check option
const currentCheckId    = new Date().getDate()
let checkId    = 0

// ****** EVENT LISTENERS **********
//! submit form
form.addEventListener('submit', addItem);
//! clear items
clearBtn.addEventListener('click', clearItems);
//! load items
window.addEventListener("DOMContentLoaded", setupItems)
// ****** FUNCTIONS **********
function addItem(e){
    e.preventDefault()

    const value = grocery.value;
    const id    = new Date().getTime().toString()

    // check option
    checkId    = 0

    if(value && !editFlag){
        createListItem(id, value, checkId)
        //display alert
    displayAlert("item added to the list", "success")
    // show container
    container.classList.add("show-container")
    // add to local storage
    addToLocalStorage(id, value, checkId)
    // set back to default
    setBackToDefault()

    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert("value changed", "success")
        // edit local storage
        editLocalStorage(editID,value)
        setBackToDefault()
    }
    else{
        // console.log("empty");

        displayAlert("please enter value", "danger")
    }
}
//! display alert
function displayAlert(text, action){
    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    // remove alert
    setTimeout(function(){
        alert.textContent =''
        alert.classList.remove(`alert-${action}`)
    },1000)
}

//! clear items
function clearItems(){
    const items = document.querySelectorAll(".grocery-item")

    if(items.length > 0){
        items.forEach(function(item){
        list.removeChild(item)
    })}

    container.classList.remove("show-container")
    displayAlert("empty list", "danger")
    setBackToDefault()
    localStorage.removeItem("list")
}
//! delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container")
    }
    displayAlert("item removed", "danger");
    setBackToDefault()
    // remove from local storage
    removeFromLocalStorage(id)
}
//! edit function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML
    editFlag      = true
    editID        = element.dataset.id
    submitBtn.textContent = "edit"
}
//! check function
function checkItem(e){

   const checkBtn = e.currentTarget
   
   const checkElement = e.currentTarget.nextElementSibling
   const checkIdEl    = e.currentTarget.parentElement
   const elId         = checkIdEl.dataset.id

   if(checkElement.classList.contains("line")){
    checkElement.classList.remove("line")
    checkBtn.innerHTML =`<i class="fas fa-circle"></i>`
    checkBtn.style.color = `var(--clr-primary-5)`
    checkId    = 0
    setCheck(checkId, elId)
}else{
    checkElement.classList.add("line")
    checkBtn.innerHTML =`<i class="fas fa-check-circle"></i>`
    checkBtn.style.color = `var(--clr-green-dark)`
    displayAlert("task completed", "success");
    checkId = new Date().getDate()
    setCheck(checkId, elId)
   }
}

//! set back to default
function setBackToDefault(){
    grocery.value = ""
    editFlag = false
    editID = ""
    submitBtn.textContent ="submit"
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id,value, checkId){
    const grocery = {id, value, checkId}
    let items     = getLocalStorage()

    items.push(grocery)
    localStorage.setItem("list", JSON.stringify(items))
}
function removeFromLocalStorage(id){
    let items = getLocalStorage()
    
    items = items.filter(function(item){
        if(item.id !== id){
            return item
        }
    })

    localStorage.setItem("list", JSON.stringify(items))
}
function editLocalStorage(id,value){
    let items = getLocalStorage()
    
    items = items.map(function(item){
        if(item.id === id){
            item.value = value
        }
        return item
    })
    localStorage.setItem("list", JSON.stringify(items))
}

function setCheck(checkId, elId){
    let items = getLocalStorage()

    items = items.map(function(item){
        if(item.id === elId){
            item.checkId = checkId
        }
        return item
    })
    localStorage.setItem("list", JSON.stringify(items))
}

function getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[]
}
// localStorage API
// setItem
// getItem
// removeItem
// save as strings
// localStorage.setItem("orange", JSON.stringify(["item","item2"]))
// const oranges = JSON.parse(localStorage.getItem("orange"))
// localStorage.removeItem("orange")
// ****** SETUP ITEMS **********

function setupItems(){
    let items = getLocalStorage()

    if(items.length > 0){
        items.forEach(function(item){
           
            if(item.checkId !== currentCheckId){
                if(item.checkId === 0){
                    createListItem(item.id, item.value, item.checkId)
                }else{
                    // remove from local storage
                    removeFromLocalStorage(item.id)
                }
            }else if(item.checkId === currentCheckId){
                createListItem(item.id, item.value, item.checkId)
            }
           
        })
        if(list.children.length === 0){
        container.classList.remove("show-container")
    }else{
            container.classList.add("show-container")
      }
    }
}

function createListItem(id, value, checkId){

    // console.log("add item to the list");
    const element = document.createElement('article')
    // add class
    element.classList.add("grocery-item")
    // add id
    const attr = document.createAttribute('data-id')
    attr.value = id
    // check id
    const checkAttr = document.createAttribute('data-checkId')
    checkAttr.value = checkId
    
    element.setAttributeNode(attr)
    element.setAttributeNode(checkAttr)
    element.innerHTML = `<button type="button" class="check ckClr">
            <i class="fas fa-circle"></i></button>
        <p class="title">${value}</p>
          <div class="btn-container">
            <button type="button" class="edit-btn">
              <i class="fas fa-edit"></i>
            <button type="button" class="delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>`
    const lineCheck = element.querySelector(".title")
    const check     = element.querySelector(".check")
    if(checkId === 0){
        lineCheck.classList.remove("line")
        check.innerHTML = `<i class="fas fa-circle"></i>`
        check.style.color = `var(--clr-primary-5)`
    }else{
        lineCheck.classList.add("line")
        check.innerHTML = `<i class="fas fa-check-circle"></i>`
        check.style.color = `var(--clr-green-dark)`
    }
    const deleteBtn = element.querySelector(".delete-btn")
    const editBtn   = element.querySelector(".edit-btn")
    check.addEventListener('click', checkItem)
    deleteBtn.addEventListener('click', deleteItem)
    editBtn.addEventListener('click', editItem)
//Append child
list.appendChild(element)

}

// --------------------------------
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];


  const currentDate = new Date()
  const weekday     = weekdays[currentDate.getDay()]
  const date        = currentDate.getDate()
  const month       = months[currentDate.getMonth()]

  currentWeek.innerHTML = weekday
  currentDay.innerHTML  = date
  currentMonth.innerHTML = month
