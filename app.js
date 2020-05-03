var budgetController = (function(){
    const Expense = function(id, description, value){
        this.id = id;
        this.descripiton = description;
        this.value = value;
    }

    const Income = function(id, descripiton, value){
        this.id = id;
        this.descripiton;
        this.value = value;
    }

    const data = {
        allItems : {
            income:[],
            expense:[]
        },
        total:{
            income:0,
            expense:0
        }
    }

})();
const Expense = function(id, description, value){
    this.id = id;
    this.descripiton = description;
    this.value = value;
}

var UIController = (function(){
    const DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn'

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
        console.log(input);

    }
    return{
        init:function(){
            console.log("Aplication Started");
            setUpEventListner();
        }
    }
})(budgetController, UIController);

controller.init();