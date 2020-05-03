var budgetController = (function(){
    const Expense = function(id, description, value){
        this.id = id;
        this.descripiton = description;
        this.value = value;
    }

    const Income = function(id, descripiton, value){
        this.id = id;
        this.descripiton = descripiton;
        this.value = value;
    }

    const data = {
        allItems : {
            inc:[],
            exp:[]
        },
        total:{
            inc:0,
            exp:0
        }
    }
    const addItem = function(type, descripiton, value){
        let newItem, ID;
        //create new ID
        ID = data.allItems[type].length;
        console.log();
        //create new Item based on inc or exp
        if(type===UIController.getDOMstring().type.income){
            newItem = new Income(ID, descripiton, value);
        }else if(type === UIController.getDOMstring().type.expense){
            newItem = new Expense(ID, descripiton, value);
        }
        //push it into our data structure
        data.allItems[type].push(newItem);
        //returning the new Item
        console.log(newItem);
        return newItem;
    }

    return{
        addItem:addItem,
        data:data
    }

})();

var UIController = (function(){
    const DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        type:{
            income:'inc',
            expense:'exp'
        },
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list'

    }
    function getInput(){
        return{
            type: document.querySelector(DOMstrings.inputType).value,
            descripiton: document.querySelector(DOMstrings.inputDescription).value,
            value:document.querySelector(DOMstrings.inputValue).value
        }
    }

    var addListItem = function(obj, type){
        //create html string with the place holder
        var html, element;
        if(type===DOMstrings.type.income){
            element = DOMstrings.incomeContainer
            html = `<div class="item clearfix" id="income-${obj.id}">
            <div class="item__description">${obj.descripiton}</div>
            <div class="right clearfix">
                <div class="item__value">${obj.value}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`
        }else if (type ===DOMstrings.type.expense){
            element=DOMstrings.expenseContainer;
            html = ` <div class="item clearfix" id="expense-${obj.id}">
            <div class="item__description">${obj.descripiton}</div>
            <div class="right clearfix">
                <div class="item__value">${obj.value}</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`
        }
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML=html;
        document.querySelector(element).insertAdjacentElement('beforeend', htmlObject);
    }
    var clearField = function(){
        var fieldList, fieldArray;
        fieldList = document.querySelectorAll(DOMstrings.inputDescription+", "+DOMstrings.inputValue);
        fieldArray = Array.prototype.slice.call(fieldList);
        fieldArray.forEach(element => {
            element.value="";
        });
        fieldArray[0].focus();

    }
    function getDOMstring(){
        return DOMstrings;
    }

    return{
        getInput:getInput,
        getDOMstring:getDOMstring,
        addListItem:addListItem,
        clearField:clearField
    }
})();

//Global App Controller
var controller = (function(budgetCtrl, UICtrl){
    function setUpEventListner(){
        const DOM = UIController.getDOMstring();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener(`keypress`, function(event){
            if(event.keyCode === 13 || event.which === 13){
               ctrlAddItem();
            }
        });
    }
    
    function ctrlAddItem(){
        //Get the field input data
        var input = UIController.getInput();
       // Add the item to the budget controller
        var newItem = budgetController.addItem(input.type, input.descripiton, input.value);
        UIController.addListItem(newItem, input.type);
        UIController.clearField();
    }
    return{
        init:function(){
            console.log("Aplication Started");
            setUpEventListner();
        }
    }
})(budgetController, UIController);

controller.init();