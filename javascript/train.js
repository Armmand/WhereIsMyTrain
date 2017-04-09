//Display current time

var myVar = setInterval(myTimer,1000);

function myTimer(){
var currentTime= (moment().format("DD/MM/YY hh:mm:ss A"));  
document.getElementById("currentTime").innerHTML=currentTime;
}

 // Initialize Firebase
    var config = {
    apiKey: "AIzaSyCmkHQYZL4BuWy8c5HA2Nh82at-mUCNGcU",
    authDomain: "train-time-927dc.firebaseapp.com",
    databaseURL: "https://train-time-927dc.firebaseio.com",
    projectId: "train-time-927dc",
    storageBucket: "train-time-927dc.appspot.com",
    messagingSenderId: "82505117141"
  };
  
    firebase.initializeApp(config);

    var database = firebase.database();
   

    // 2. Button for adding train information
$("#addTrain").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#trainName-input").val().trim();
  var destination  = $("#destination-input").val().trim();
  var firstTrain = $("#firstTrain-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train information
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  
  // Alert
  alert("Train successfully added");

  
  // Train Info
  console.log(trainName);
  console.log(destination);
  console.log(firstTrain);
  console.log(frequency);

  //clear all of the text-boxes
  $("#trainName-input").val("");
  $("#destination-input").val("");
  $("#firstTrain-input").val("");
  $("#frequency-input").val("");

  //Prevent moving to new page
  return false;
 
});

//Create Firebase event for adding to the database and a 
//row in the htmls when a user adds an entry
database.ref().on("child_added",function(childSnapshot,prevChildKey){

  console.log(childSnapshot.val());

  //store everything into a variable

  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

// First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
  console.log(firstTrainConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  //add each train's data into the table
  $("#train-table> tbody").append("<tr><td>"+ trainName+"<td>"+ destination+ "<td>"+frequency+"<td>"+nextTrain.format("hh:mm")+"<td>"+tMinutesTillTrain+"<td>");

});