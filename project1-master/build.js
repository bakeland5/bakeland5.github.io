var colleges = [
  'Colleges',
  'ACES',
  'Applied Health Sciences',
  'Applied Life Sciences',
  'Aviation',
  'Business',
  'Education',
  'Engineering',
  'Fine and Applied Arts',
  'Labor and Industrial Relations',
  'LAS',
  'Law',
  'Media',
  'Social Work',
  'VetMed',
  'iSchool',
  'Graduate',
  'LN',
  'NB',
  'DGS',
  'LM',
  'Medicine'
];


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var tab = '<button class="tablink" onclick="updateGraph(\'%college%\')">%college%</button>'
var graph = ''

function updateGraph( college ) {

  document.getElementById("chart-label").innerHTML = college;

  var chart = document.getElementById("chart-svg");

  chart.parentNode.removeChild(chart);


  drawGraph( college );

  // var newGraph = graph.replaceAll( "%college%", college );
  //

}

function addTab( college ) {

  var replacedTab = tab.replaceAll( "%college%", college );

  var container = document.getElementById('tabs');

  var child = document.createElement('div');

  child.innerHTML = replacedTab;

  child = child.firstChild;
  //
  container.appendChild(child);



}

colleges.forEach(function(c) {
  addTab( c );
});
