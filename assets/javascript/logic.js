

var config = {
    apiKey: "AIzaSyAqGxlKLChexwW05-zBUtiaPdcn4QC4tPU",
    authDomain: "train-schedule-55aa1.firebaseapp.com",
    databaseURL: "https://train-schedule-55aa1.firebaseio.com",
    projectId: "train-schedule-55aa1",
    storageBucket: "train-schedule-55aa1.appspot.com",
    messagingSenderId: "435691710363"
  };

firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainFirst = moment($("#first-input").val().trim(), "hh:mm:ss").format("hh:mm:ss");
  var trainFrequency = moment($("#frequency-input").val().trim(), "mm").format("mm");
  
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    first: trainFirst,
    frequency: trainFrequency,
  };

  database.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#frequency-input").val("");
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFirst = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;

  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFirst);
  console.log(trainFrequency);

  var trainMinutesAway = tMinutesTillTrain;
  var tFrequency = trainFrequency;
  var firstTime = trainFirst;

  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  $("#train-table > tbody").append(
    "<tr><td>" + trainName + 
    "</td><td>" + trainDestination + 
    "</td><td>" + trainFrequency + 
    "</td><td>" + moment(nextTrain).format("hh:mm") + 
    "</td><td>" + tMinutesTillTrain + " mins" +
    "</td></tr>");
});