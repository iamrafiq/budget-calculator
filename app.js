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
        }

    }
    function getInput(){
        return{
            type: document.querySelector(DOMstrings.inputType).value,
            descripiton: document.querySelector(DOMstrings.inputDescription).value,
            value:document.querySelector(DOMstrings.inputValue).value
        }
    }

    function getDOMstring(){
        return DOMstrings;
    }

    return{
        getInput:getInput,
        getDOMstring:getDOMstring
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
       // console.log(input);
        budgetController.addItem(input.type, input.descripiton, input.value);
    }
    return{
        init:function(){
            console.log("Aplication Started");
            setUpEventListner();
        }
    }
})(budgetController, UIController);

controller.init();