const url = "https://script.google.com/macros/s/AKfycbxWX44-XcGqNrfW3-Dgm-QWv76QFRcm2el_3Nokz0nn3oDNyVnU-cdkbkkerIWyCNSN/exec"
var numberofShrek = 0;
var dateTo = null;
var dateNo = '2022-06-12T16:33:01.000Z';
var canSaveCharacter = null;
$(document).ready(function() {
    
    $(".modal").on("hidden.bs.modal", function(){        // reset the forms when the modal closes
       document.getElementById('characterForm').reset();
       document.getElementById("delCharacterForm").reset();
       $(".characterName").removeClass("is-invalid");
       $(".name").removeClass("is-invalid");
       $(".pin").removeClass("is-invalid");

    });
    animateDiv($("#shrekMov"));      //start the animation on the first shrek

    var StimerShrek = setInterval(()=>{  // adds a new mini shrek every 3s, only the first one can be clickable
       addMiniShrek();
    },3000);
   
    //countdown
    seeIfAvailable()
    
    $(document).on("click", ".characters", function(event){ //checks if the user can take a new chracter
        if(canSaveCharacter == "True"){
            var character = event.target.getAttribute("data-bs-whatever");
        $("#characterName1").val(character);
        $("#buttons").removeClass("visually-hidden")
        $("#rowForList").addClass("visually-hidden")
        $("#characterList").empty();
        $("#getCharacterModal").modal("show")
        }else{
            alert("Todavía no se puede ansioseee")
        }
    });
    $(document).click(()=>{
        addMiniShrek();
    })
    
});
function addMiniShrek(){
    if(numberofShrek< 50){
        numberofShrek = numberofShrek + 2
    $("#divMovment").append(
        `<div class="col-8">
    <div id="shrekMov`+numberofShrek+`" class="a" style="cursor: pointer;">
        <img draggable="false" src="images/shrek_sinfondo.gif" alt="" width="50" height="50">
    </div>
   </div>`)
    animateDiv($("#shrekMov"+numberofShrek))
    }

}

function sendingRequest(){       //function to show a loading sign when waiting for the get response
    $(".characterName").removeClass("is-invalid");
    $(".name").removeClass("is-invalid");
    //$(".buttonSend").html("Cargando...")
    $(".buttonSend").addClass("disabled")
}

$("#characterForm").submit(function( event ) {     // get to get a new character
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
      sendingRequest()
  });

$("#delCharacterForm").submit(function( event ) {       // to delete a character
    const dictionaryData = {};
    const formData= $(this).serializeArray();
    formData.forEach(({name, value}) => dictionaryData[name] = value.toLowerCase());
    event.preventDefault();
    dictionaryData.type = "delete"
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(dictionaryData),
        success: success,
        dataType: "json",
      });
      sendingRequest()
  });

function success(data){                    // handele the responses of the differents http methods
    $(".buttonSend").removeClass("disabled")
    if (data.code == 400){
        $(".characterName").addClass("is-invalid");
       $(".invalidCharacterName").html("Ingrese un personaje.");
    }
    if (data.code == 401){
        $(".name").addClass("is-invalid");
       $(".invalidName").html("Ingrese un Nombre.");
    }
     if (data.code == 404){
         $(".characterName").addClass("is-invalid");
        $(".invalidCharacterName").html("Este personaje no existe.");

     }
     if (data.code == 409){
        $(".characterName").addClass("is-invalid");
        $(".invalidCharacterName").html("Este personaje ya ha sido asignado.");
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
    if(data.code == 410){ 
        $(".pin").addClass("is-invalid");
        $(".invalidPin").html("El pin es inválido.");
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

function startTimer(){
    var countDownDate= new Date(dateTo).getTime()
    var timer = setInterval(()=>{
       // now = Date.parse(dateNo)
       // console.log(dateNo)
        var dateNow = Date.now();
       // console.log(now)
        var distance = countDownDate - dateNow;
        // console.log(Date(dateToMiliseconds))
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        $("#countdownTime").text(days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ");
        if (distance < 0) {            // reloads page if timer less than 0
            location.reload();
          }
    },1000)
}

function seeIfAvailable(){
    $.ajax({
        type: "GET",
        url: url,
        data: {query : "isAvailable"},
       success: succesDate,
        dataType: "json",
      });
    
}
function succesDate(data){
    canSaveCharacter = data.result;
    dateTo =data.date;
    var fecha = new Date(dateTo)
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute:"2-digit"};
    
    $(".dateToOpen").text(fecha.toLocaleDateString("es-US", options))

    if(data.result== "False"){
        startTimer();
        $("#countdown").removeClass("visually-hidden")

        //$("#countdown").removeClass("visually-hidden")
    }else{
        $("#countdown").addClass("visually-hidden")
        $("#btnDelCharacter").removeClass("disabled")
        $("#btnNewCharacter").removeClass("disabled")
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
    $("#characterList").append( ' <li class="list-group-item list-group-item-danger">Cargando...</li>   ')
    
}
function success2(data){ 
    $("#characterList").html("")
    data.slice(1).forEach((i)=>{
        if (i.taken == "x"){    
            $("#characterList").append( ' <li class="list-group-item list-group-item-danger">'+ i.name+'</li>   ')
        }else{ 
            $("#characterList").append( ` <button class="list-group-item list-group-item-action list-group-item-success characters" type="button"  data-bs-whatever="`+i.name+`">`+i.name+`</button> `)
    }
    }
    )
}
// <li class="list-group-item list-group-item-success">`+ i.name+`</li>  
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
    var newq = makeNewPosition($("#divMovment"));
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