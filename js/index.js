//Array for checking duplicate entries
let orders=["","","","","","","","","",""];
let order=1,totValue=0,orderCount=0;

$("#btnNewOrder").attr("disabled", true);
$("#btnUpdate").hide();

//getting current time n data
function getTimendate(n) {
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    var date=dt.getDate()+"/"+(dt.getMonth()+1)+"/"+dt.getFullYear();
    if(n==1)return time;
    else return date;
}

//update current date n time on the site
setInterval(function(){

    $("#lblOrderTime").text(getTimendate(1)); // document.getElementById("lblOrderTime").innerHTML
    $("#lblOrderDate").text(getTimendate(0));  //document.getElementById("lblOrderDate").innerHTML

}, 1000)

//set 2 drop down lists
$(document).ready(function () {
    for (let i=0;i<CUSTOMERS.length;i++){
        $("#cmbCustomerID").append(` <option>${CUSTOMERS[i].id}</option>`)
    }

    for (let j=0;j<ITEMS.length;j++){
        $("#cmbItemCode").append(` <option>${ITEMS[j].code}</option>`)
    }

});

//setting customer selecting area
$( "#cmbCustomerID" ).change(function() {
    for (let i=0;i<CUSTOMERS.length;i++){
        if(CUSTOMERS[i].id==$(this).val()){
            $("#lblCustomerName").text(CUSTOMERS[i].name); //document.getElementById("lblCustomerName").innerHTML
        }
    }

});

//setting Item selecting area
$( "#cmbItemCode" ).change(function() {
    for (let i = 0; i < ITEMS.length; i++) {
        if (ITEMS[i].code == $(this).val()) {
             $("#lblItemDescription").text(ITEMS[i].description);  //document.getElementById("lblItemDescription").innerHTML
             $("#lblUnitPrice").text(ITEMS[i].unitPrice);  //document.getElementById("lblUnitPrice").innerHTML
            $("#lblQtyOnHand").text(ITEMS[i].qtyOnHand); //document.getElementById("lblQtyOnHand").innerHTML
        }
    }
});

//function for button add cart
$(document).ready(function () {
    $("#btnAddCart").click(function () {

        let qty=  $("#txtQty").val() //document.getElementById("txtQty").value;
        let itemcode = $("#cmbItemCode").val()  //document.getElementById("cmbItemCode").value;
        let des = $("#lblItemDescription").text()  //document.getElementById("lblItemDescription").textContent;
        let unitPRice = $("#lblUnitPrice").text()  //document.getElementById("lblUnitPrice").textContent;

        if($("#btnAddCart").text().trim()!="Update"){
            if(qty!=="" && des!==" " && checkQty(itemcode,qty)) {

                updateTable(itemcode,qty,"min");
                let tot = parseInt(qty) * parseInt(unitPRice)
                totValue+=tot;
                setTotal(totValue);
                if(checkTable(itemcode)){
                    handleDuplicateRows(itemcode,qty);
                }else
                    $("#tblbdy1").append(`<tr class="currentRow"><td class=\"text-center itemIDCell updateRow\">${itemcode}</td><td class="\itemDESCell updateRow\">${des}</td><td class=\"text-center temUPCell updateRow\">${unitPRice}</td><td class=\"text-center temQTYCell updateRow\">${qty}</td><td class=\"text-right updateRow\">${tot}</td><td class="hoverCEll"> <input class="dltbtn" type="image" src="images/recyclebin.png" width="30" height="30" /></td></tr>`)

                //<button id="btnrmv" type="button" class="btn btn-dangerx"><img src="images/recyclebin.png" width="30" height="30"> </button>
                //class="updateRow"
                clrFields();

            }else alert("Enter Item Details Correctly");
        }else{
            let qty= document.getElementById("txtQty").value;
            let itemcode = document.getElementById("cmbItemCode").value;

            let unitPRice = document.getElementById("lblUnitPrice").textContent;
            let tot = parseInt(qty) * parseInt(unitPRice)
            totValue+=tot;
            setTotal(totValue);

            handleUpdatedRows(itemcode,qty);
            updateTable(itemcode,qty,"min");
            $("#btnUpdate").hide(500);

            enableORdisableOption(false);

            clrFields();
            $("#btnAddCart").html('<i class="fas fa-cart-plus"></i> Add to Cart');

        }


        });
});
//<button id="btnrmv" type="button" class="btn btn-danger btnDelete disble">Remove</button><button id="btnedt" type="button" class="btn btn-warning btnSelect ">Update</button>

////function for button update
//$(document).on('click','.updatedata',function () {


//});

//function for delete row
$(document).on('click', '.hoverCEll', function () {
    $(this).parents('tr').remove();
    var currentRow=$(this).closest("tr");

    var currentTot=currentRow.find("td:eq(4)").text();
    var itemCode=currentRow.find("td:eq(0)").text();
    var qty=currentRow.find("td:eq(3)").text();
    totValue-=currentTot;
    setTotal(totValue)

    for (let i=0;i<10;i++)
        if (orders[i] == itemCode)orders.splice(i, 1);
            //orders[i]="";

    updateTable(itemCode,qty,"add");

});

////function for button place order
$(document).ready(function () {
    $("#btnPlaceOrder").click(function () {
        let CName=$("#lblCustomerName").text(); //document.getElementById("lblCustomerName").textContent;
        let CID=$("#cmbCustomerID").val();   //document.getElementById("cmbCustomerID").value;

        if(CName!="" && totValue!=0) {
            let OId = $("#lblOrderId").text(); //document.getElementById("lblOrderId").textContent;
            let ODate =$("#lblOrderDate").text(); // document.getElementById("lblOrderDate").textContent;

            $("#tblbdy2").append(`<tr class="updatePlaceOrder"><td class=\"text-center\">${OId}</td><td class=\"text-center\">${ODate}</td><td class=\"text-center\">${CID}</td><td>${CName}</td><td class=\"text-right\">${totValue}</td></tr>`)
           // document.getElementById("tblbdy1").innerHTML=" "

            enableORdisableOption(true);
            $("#btnAddCart").attr("disabled", true);
            $("#txtQty").attr("disabled", true);

            getTableData();
            alert("Order is added to the table\nClick NEW ORDER button to place a new order\nTHANK YOU!!")
            order++;

            document.getElementById("tblbdy1").innerHTML=" "
            document.getElementById("cmbItemCode").value = "selectItem";
            document.getElementById("cmbCustomerID").value = "selectCID";
            document.getElementById("lblCustomerName").innerHTML = " ";
            $("#btnNewOrder").attr("disabled", false);

            $("#btnNewOrder").focus();

        }else{
            if(CName=="")alert("Choose Customer Name")
            else alert("Enter Details Correctly")
        }

    });
});

//function for button new order
$(document).ready(function () {
    $("#btnNewOrder").click(function () {
        document.getElementById("lblOrderId").innerHTML="P00"+order;

        enableORdisableOption(false);
        $("#txtQty").attr("disabled", false);

        totValue=0;
        setTotal(totValue)
        $("#btnNewOrder").attr("disabled", true);
        $('#tblbdy2 tr').each(function() {
            $(this).addClass("updatePlaceOrder");
        });
        clrFields();
        enableORdisableOption(false);
        document.getElementById("tblbdy1").innerHTML=" "
        document.getElementById("cmbItemCode").value = "selectItem";
        document.getElementById("cmbCustomerID").value = "selectCID";
        document.getElementById("lblCustomerName").innerHTML = " ";

    });
});


function checkTable(itemCode) {
    let status=false;
    for (let i=0;i<10;i++)
        if(orders[i]==itemCode)status=true;

    //if()
    if(!status){
        orders[orderCount]=itemCode;
        orderCount++;
        return false;
    }
    else {
        return true;
    }
}

function handleDuplicateRows(itemCode,qty) {
   // alert("ddd")
    $('#tblOrderDetails .itemIDCell').each(function() {
        let x=itemCode;
        if(x.localeCompare($(this).html())==0){
           // alert("ddd")
            var currentRow=$(this).closest("tr");
            var currentCell=currentRow.find("td:eq(3)").text();
            var currentQTY=parseInt(currentCell)+parseInt(qty)

            currentRow.find("td:eq(3)").html(currentQTY);
            currentRow.find("td:eq(4)").html(totValue);

           // alert(currentQTY)
        }
    });

}

function handleUpdatedRows(itemCode,qty) {
    // alert("ddd")
    $('#tblOrderDetails .itemIDCell').each(function() {
        let x=itemCode;
        if(x.localeCompare($(this).html())==0){
            // alert("ddd")
            var currentRow=$(this).closest("tr");
           // var currentCell=currentRow.find("td:eq(3)").text();
            var currentQTY=parseInt(qty)

            currentRow.find("td:eq(3)").html(currentQTY);
            currentRow.find("td:eq(4)").html(totValue);

            // alert(currentQTY)
            currentRow.find("td:eq(5)").addClass("hoverCEll");
        }
    });

}

///////////hover functions of the delete icon/////////////////
$(document).on('mouseover', '.hoverCEll', function () {

    $(this).html('<input class="dltbtn" type="image" src="images/recyclebin-hover.png" width="30" height="30" />');
});
$(document).on('mouseleave', '.hoverCEll', function () {

    $(this).html('<input class="dltbtn" type="image"  src="images/recyclebin.png" width="30" height="30" />');
});
///////////////////////////////////////////////////////////////


function updateTable(itemcode,qty,func) {
   //alert(itemcode+""+qty+""+ITEMS[0].code+" ")
    for (let i = 0; i < 10; i++)
    {
        if (ITEMS[i].code == itemcode && func=="min")
        {
            ITEMS[i].qtyOnHand -=parseInt(qty) ;
        }
        if (ITEMS[i].code == itemcode && func=="add")
        {
            ITEMS[i].qtyOnHand +=parseInt(qty) ;
        }
    }
}

function checkQty(itemcode,qty) {

    for (let i = 0; i < 10; i++) {
        if (ITEMS[i].code == itemcode) {
            if (ITEMS[i].qtyOnHand >= qty) return true;
            else {
                alert("Entered Quantity is higher than Quantity on hand")
                $("#txtQty").focus().select();
                return false;

            }
        }
    }

}
////function for update a row
$(document).on('click','.updateRow',function () {
    var currentRow=$(this).closest("tr");
    var currentTot= currentRow.find("td:eq(4)").text();
    var itemCode= currentRow.find("td:eq(0)").text();
    var qty= currentRow.find("td:eq(3)").text();
   totValue-=currentTot;
    setTotal(totValue);
    updateTable(itemCode,qty,"add");

    document.getElementById("cmbItemCode").value = itemCode;
    for (let i = 0; i < ITEMS.length; i++) {
        if (ITEMS[i].code == itemCode) {
            document.getElementById("lblItemDescription").innerHTML = ITEMS[i].description;
            document.getElementById("lblUnitPrice").innerHTML = ITEMS[i].unitPrice;
            document.getElementById("lblQtyOnHand").innerHTML = ITEMS[i].qtyOnHand;
        }
    }
    document.getElementById("txtQty").value = qty;
    $("#txtQty").focus().select();
  //  $("#btnUpdate").show(500);
    $("#btnAddCart").text("Update");

    enableORdisableOption(true);

    //$("#tblOrderDetails").attr('disabled', true);
    currentRow.find("td:eq(5)").removeClass("hoverCEll");

})


function clrFields() {
    document.getElementById("lblItemDescription").innerHTML = " ";
    document.getElementById("lblUnitPrice").innerHTML = " ";
    document.getElementById("lblQtyOnHand").innerHTML = " ";
    document.getElementById("txtQty").value = " ";
    document.getElementById("cmbItemCode").value = "selectItem";
}

function enableORdisableOption(status) {
    if(status){
        $("#btnPlaceOrder").attr("disabled", true);
     //   $("#btnAddCart").attr("disabled", true);
        $("#cmbCustomerID").attr("disabled", true);
        $("#cmbItemCode").attr("disabled", true);
    }else{
        $("#btnPlaceOrder").attr("disabled", false);
        $("#btnAddCart").attr("disabled", false);
        $("#cmbCustomerID").attr("disabled", false);
        $("#cmbItemCode").attr("disabled", false);
    }
}

function setTotal(totValue) {
    document.getElementById("lblTotal").innerHTML = totValue+".00";
}
//updatePlaceOrder

function getTableData(){
    $('#tblbdy1 tr').each(function() {

            var itemID=$(this).find("td:eq(0)").text();
        var itemDES=$(this).find("td:eq(1)").text();
        var itemUP=$(this).find("td:eq(2)").text();
        var itemQTY=$(this).find("td:eq(3)").text();
        var itemTOT=$(this).find("td:eq(4)").text();
        var CName=$("#lblCustomerName").text(); //document.getElementById("lblCustomerName").textContent;
        var CID=$("#cmbCustomerID").val();
        let subOrder={id: "P00"+order,code: itemID, description: itemDES,unitPrice: itemUP,qtyOnHand: itemQTY,total : itemTOT,FinalTot: totValue,Cname: CName,CID: CID};
        ORDERS.push(subOrder);
    });
}
$(document).on('click','.updatePlaceOrder',function () {
   // alert(ORDERS[0].code);
    for(let i=0;i<ORDERS.length;i++){
        $("#tblbdy1").append(`<tr class="currentRow"><td class=\"text-center itemIDCell updateRow\">${ORDERS[i].code}</td><td class="\itemDESCell updateRow\">${ORDERS[i].description}</td><td class=\"text-center temUPCell updateRow\">${ORDERS[i].unitPrice}</td><td class=\"text-center temQTYCell updateRow\">${ORDERS[i].qtyOnHand}</td><td class=\"text-right updateRow\">${ORDERS[i].total}</td><td></td></tr>`)
        enableORdisableOption(false);
        $("#txtQty").attr("disabled", false);
        totValue=ORDERS[i].FinalTot
        setTotal(totValue);
        $("#btnNewOrder").attr("disabled", true);
        document.getElementById("lblOrderId").innerHTML=ORDERS[i].id;
        $("#lblCustomerName").text(ORDERS[i].Cname);
        $("#cmbCustomerID").val(ORDERS[i].CID);
    }
    enableORdisableOption(true);
    $("#btnAddCart").attr("disabled", true);
    $("#btnNewOrder").attr("disabled", false);
    $(this).removeClass("updatePlaceOrder");


});
