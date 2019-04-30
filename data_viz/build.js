var colleges = {
  "Engineering" : ["ABE", "AE", "BIOE", "CEE", "CS", "ECE", "ENG", "GE", "IE", "ME", "MSE", "NPRE", "TAM", "TE"],
  "LAS" : ["AAS", "AFRO", "ANTH", "ARTH", "ASTR", "ATMS", "BIOC", "CHBE", "CHEM", "CLCV", "CMN", "CW", "CWL", "EALC", "ECON", "ENGL", "ESE", "FR", "GEOG", "GEOL", "GER", "GLBL", "GWS", "HIST", "IB", "ITAL", "JAPN", "KOR", "LAS", "LAST", "LING", "LLS", "MATH", "MCB", "PHIL", "PHYS", "PS", "PSYC", "REES", "REL", "RHET", "RLST", "SCAN", "SOC", "SPAN", "STAT"],
  "ACES" : ["ACE", "AGCM", "AGED", "ANSC", "CPSC", "FSHN", "HDFS", "HORT", "NRES", "TSM"],
  "Business" : ["ACCY", "BADM", "BUS", "FIN", "SE"],
  "FAA" : ["ARCH", "ART", "ARTD", "ARTF", "ARTS", "DANC", "FAA", "LA", "MUS", "THEA", "UP"],
  "Education" : ["CI", "EDUC", "EPSY", "HRD", "SPED"],
  "Media" : [ "ADV", "JOUR", "MACS", "MDIA", "MS"],
  "AHS" : ["CHLH", "IHLT", "KIN", "REHB", "RST", "SHS"],
  "iSchool" : ["INFO", "IS"],
  "Other/Unknown" : ["AFST", "BTW", "GCL", "LER", "PLPA", "SOCW"]
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// var tab = '<div id=\'%college%\' class=\'dropdown\' ><button class="tablink" onclick="addDropdown(\'%college%\')">%college%</button></div>'
var tab = '<div class="tab"><button id="%college%-tab" class="tablink" onclick="showDropdown(\'%college%\')">%college%</button><div id="%college%-dropdown" class="dropdown-content"></div></div>';
var subjectButton = '<button id="%subject%-button" class= "dropdown-button" onclick="toggleSubject(\'%subject%\')" >%subject%</button>';
var dropdownButton = '<button class="dropdown-button tablink" onclick="updateGraph(\'%subject%\')">%subject%</button>'
var filterTemp = '<div id="%subject%-filter" class="filter"><span>%subject%</span><button onclick="toggleSubject(\'%subject%\')">X</button></div>'



var filters = [];

function showDropdown( college ) {
  var id = college + "-dropdown";
  if ( document.getElementById(id).style.display == "block") {
    document.getElementById(id).style.display = "none";
  } else {
    document.getElementById(id).style.display = "block";
  }
}

function updateGraph( filters, search=null ) {

  // document.getElementById("chart-label").innerHTML = college;

  var chart = document.getElementById("chart-svg");

  chart.parentNode.removeChild(chart);

  drawGraph( filters, search );
}

function addDropdown( college ) {
  console.log( colleges[college] );
  var subjects = colleges[college];
  for (var i = 0, len = subjects.length; i < len; i++) {
    var newButton = dropdownButton.replaceAll( "%subject%", subjects[i] );

    var container = document.getElementById(college);

    var child = document.createElement('div');
    child.innerHTML = newButton;

    child = child.firstChild;
    container.appendChild(child);
  }
}

function addTab( college ) {

  var replacedTab = tab.replaceAll( "%college%", college );

  var container = document.getElementById('tabs');

  var child = document.createElement('div');
  child.innerHTML = replacedTab;
  child = child.firstChild;

  container.appendChild(child);

  for ( var i = 0; i < colleges[college].length; i++ ) {
    addSubjectButton( college, colleges[college][i] );
  }
}

function addFilterButton( subject ) {

  var replacedFilter = filterTemp.replaceAll( "%subject%", subject );

  var container = document.getElementById('filters');

  var child = document.createElement('div');
  child.innerHTML = replacedFilter;
  child = child.firstChild;
  container.appendChild(child);

}
function toggleSubject( subject ) {
  var found = filters.includes( subject );

  if ( !found ) {
    addSubjectToGraph( subject );
  } else {
    removeSubjectFromGraph( subject );
    updateGraph( filters );
  }
}

function addSubjectButton( college, subject ) {

  var replacedSubject = subjectButton.replaceAll( "%subject%", subject );

  var container = document.getElementById( college + "-dropdown" );

  var child = document.createElement('div');
  child.innerHTML = replacedSubject;
  child = child.firstChild;
  container.appendChild(child);
}


function addSubjectToGraph( subject ) {
  var found = false;

  for ( var i = 0; i < filters.length; i++ ) {
    if ( filters[i] === subject ) {
      found = true;
    }
  }
  if ( found ) {
    return;
  }

  filters.push( subject );

  document.getElementById( subject + "-button" ).style["background-color"] = colors[subjectColors[subject]];
  // document.getElementById( subject + "-button" ).parentNode.parentNode.querySelectorAll('.tablink')[0].style["background-color"] = "#555";
  document.getElementById( subjToCollege[subject] + "-tab" ).style["background-color"] = "#555";

  addFilterButton( subject );


  updateGraph( filters );
}

function removeSubjectFromGraph( subject ) {

  var collegeIsUsed = false;
  var currCollege = subjToCollege[subject];

  for ( var i = 0; i < filters.length; i++ ) {
    if ( filters[i] === subject ) {
      filters.splice(i, 1);
    }

    if ( subjToCollege[filters[i]] === currCollege ) {
      collegeIsUsed = true;
    }

  }
  document.getElementById( subject + "-filter" ).remove();

  document.getElementById( subject + "-button" ).style["background-color"] = "#000";
  if ( !collegeIsUsed ) {
    document.getElementById( subjToCollege[subject] + "-tab" ).style["background-color"] = "#000";
  }
}

function clearSubjects() {
  // filters = [];
  // updateGraph( filters );
  while ( filters.length > 0 ) {
    removeSubjectFromGraph( filters[0] );
  }
  updateGraph( filters );
}

window.onclick = function(event) {
  // console.log( event.target );
  // console.log( event.target.matches('.dropdown-button') );

  if ( !event.target.matches('.tablink') && !event.target.matches('.dropdown-button')  ) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      if ( dropdowns[i].style.display == "block" ) {
         dropdowns[i].style.display = "none";
      }
    }
  }
}

function searchForClass() {



  var searchSubject = document.getElementById("subject-input").value.toUpperCase();
  var searchNumber = document.getElementById("number-input").value;

  var search = { "subj": searchSubject, "num" : searchNumber };

  if ( subjToCollege[ search.subj ] === undefined ) {
    return;
  }

  console.log( searchSubject );
  console.log( subjToCollege[ searchSubject ] === undefined );

  addSubjectToGraph( searchSubject );

  // var search = null;
  // if ( subjToCollege[ searchSubject ] !== undefined && !isNaN( searchNumber ) ) {
  //   search = { "subj": searchSubject, "num" : searchNumber };
  // }

  document.getElementById("clear-search").disabled = false;


  updateGraph( filters, search);
  return false;
}
function clearSearch() {
  document.getElementById("clear-search").disabled = true;

  document.getElementById("subject-input").value = "";
  document.getElementById("number-input").value = "";
  updateGraph( filters );
}

function makeColor(colorNum, colors) {
    if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
    return colorNum * (360 / colors) % 360;
}


Object.keys(colleges).forEach(function(c) {
  addTab( c );
});

subjToCollege = {};
var collegekeys = Object.keys(colleges);
for ( var i = 0; i < collegekeys.length; i++ ) {
  var currSubjects = colleges[ collegekeys[i] ];

  for ( var j = 0; j < currSubjects.length; j++ )  {
    subjToCollege[ currSubjects[j] ] = collegekeys[i];
  }
}

var colors = [];

for ( var i = 0; i < 161; i++ ) {
  colors.push( "hsl( " + makeColor(i, 161) + ", 100%, 50% )" );
}

drawGraph( null, null );
