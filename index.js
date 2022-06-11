
// $("#buttonSend").click( function(){
//     // var formData = JSON.stringify($("#hola").serializeArray());
//     formData = $("#hola").serializeArray();
//     console.log(formData)
//     alert(formData)
// });
const url ="https://script.google.com/macros/s/AKfycbxPlpPIx8TVI8JTMRoH2gILJ1Iw9ues6W79XsLmFAJ28xmMdihS5fZoUtMbxdIS2908/exec"
var numberofShrek = 0;
var dateTo = null;
$(document).ready(function() {
    
    $(".modal").on("hidden.bs.modal", function(){
       document.getElementById('characterForm').reset();
       $("#characterName").removeClass("is-invalid")
       $("#name").removeClass("is-invalid")
    });
    animateDiv($("#shrekMov"));

    setInterval(()=>{
        if(numberofShrek< 50){
            numberofShrek = numberofShrek + 2
        $("#divMovment").append(
            `<div class="col-8">
        <div id="shrekMov`+numberofShrek+`" class="a">
            <img src="images/shrek_sinfondo.gif" alt="" width="50" height="50">
        </div>
       </div>`)
        animateDiv($("#shrekMov"+numberofShrek))
        }
    },4000)
    
    //countdown
    seeIfAvailable()
});

$("#characterForm").submit(function( event ) {
    const dictionaryData = {};
    const formData= $(this).serializeArray();
    formData.forEach(({name, value}) => dictionaryData[name] = value.toLowerCase());

    event.preventDefault();
  
   dictionaryData.type = "add"
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(dictionaryData),
        success: success,
        dataType: "json",
      });
  });

$("#delCharacterForm").submit(function( event ) {
    const dictionaryData = {};
    const formData= $(this).serializeArray();
    formData.forEach(({name, value}) => dictionaryData[name] = value.toLowerCase());
    //TODO: matis ajax
    event.preventDefault();
   
   dictionaryData.type = "delete"
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(dictionaryData),
        success: success,
        dataType: "json",
      });
  });
function success(data){
    if (data.code == 400){
        $("#characterName").addClass("is-invalid");
       $("#invalidFeedback").html("Ingrese un personaje.");
    }
    if (data.code == 401){
        $("#name").addClass("is-invalid");
       $("#invalidFeedbackName").html("Ingrese un Nombre.");
    }
     if (data.code == 404){
         $("#characterName").addClass("is-invalid");
        $("#invalidFeedback").html("Este personaje no existe.");

     }
     if (data.code == 409){
        $("#characterName").addClass("is-invalid");
        $("#invalidFeedback").html("Este personaje ya ha sido asignado.");
     }
     if(data.code==201){
       $("#getCharacterModal").modal("hide");
       $("#resultModal").find(".modal-body").html(` <p>Se ha guardado su personaje: `+data.characterName+` </p>
         <p>Su pin para cambiarlo es: <span class="fw-bold">`+data.pin+` </span>  GUARDALO  </p>  `)
       $("#resultModal").modal("show");

     }
    if(data.code == 411){ 
        $("#deleteCharacterModal").modal("hide");
        $("#resultModal").find(".modal-body").html(` <p>Su selección al personaje fue eliminada. </p>  `)
        $("#resultModal").modal("show");
 
     }
     
 };



$("#btnGetCharacters").click(()=>{
    $("#buttons").addClass("visually-hidden");
    $("#rowForList").removeClass("visually-hidden");
    getListNames();

})


$("#goBack").click(()=>{
    $("#buttons").removeClass("visually-hidden")
    $("#rowForList").addClass("visually-hidden")
    $("#characterList").empty();
})

 $("#shrekMov").click( function(){
    $("#divMovment").addClass("visually-hidden")
    $("#buttons").removeClass("visually-hidden")
 })

 function seeIfAvailable(){
     var result = null;
    $.ajax({
        type: "GET",
        url: url,
        data: {query : "isAvailable"},
       success: succesDate,
        dataType: "json",
      });
    
}
function succesDate(data){
    if(data.result== "False"){
        dateTo =data.date
        var x= setInterval(()=>{
            seeIfAvailable()
            date = Date.parse(dateTo)
            var now = Date.now();
            var distance = date-now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            $("#countdownTime").text(days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ");
        },1000)
        //$("#countdown").removeClass("visually-hidden")
    }else{
        $("#btnDelCharacters").removeClass("disabeled")
        $("#btnNewCharacter").removeClass("disabeled")
    }
}


function getListNames(){
    $.ajax({
        type: "GET",
        url: url,
        data: {query : "getNames"},
        success: success2,
        dataType: "json",
      });
}
function success2(data){ 
    data.slice(1).forEach((i)=>{
        if (i.taken == "x"){    
            $("#characterList").append( ' <li class="list-group-item list-group-item-danger">'+ i.name+'</li>   ')
        }else[
            $("#characterList").append( ' <li class="list-group-item list-group-item-success">'+ i.name+'</li>   ')
        ]
    }
    )
}

//http://jsfiddle.net/j2PAb/

function makeNewPosition($container) {
    
    var offset = $container.offset();
    var top = offset.top ;
    var bott = top + $container.height() -50;
    var left = offset.left;
    var right = left + $container.width() -50;
    var nh = Math.floor(Math.random() * (bott-top))+top;
    var nw = Math.floor(Math.random() * (right-left))+left;
    return [nh, nw];
}

function animateDiv($target) {
    var newq = makeNewPosition($(divMovment));
    var oldq = $target.offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);

    $target.animate({
        top: newq[0],
        left: newq[1]
    }, speed, function() {
        animateDiv($target);
    });
    
};

function calcSpeed(prev, next) {

    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);

    var greatest = x > y ? x : y;

    var speedModifier = 0.1;

    var speed = Math.ceil(greatest / speedModifier);

    return speed;

}