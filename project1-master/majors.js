
// Using jQuery, read our data and call visualize(...) only once the page is ready:

// $(function() {
//
//   d3.csv("data_grouped.csv").then(function(data) {
//     // Write the data to the console for debugging:
//     // console.log("HELLO");
//     // console.log(data);
//     // Call our visualize function:
//     visualize(data);
//   });
// });
function drawGraph( major ) {
  if ( major === "Colleges" ) {
    d3.csv("data_CollegeByYear.csv").then(function(data) {
      visualizeCollege( data, major );
    })
    return;
  }
  d3.csv("data_grouped.csv").then(function(data) {
    visualizeCollege( data, major );
  })
}

var visualizeCollege = function(data, major) {
  // Boilerplate:
  var transitions = 1;
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width =  window.innerWidth - margin.left - margin.right,
     height =  (window.innerHeight * (4/5)) - margin.top - margin.bottom;

  var svg = d3.select("#chart")
    .append("svg")
    .attr("id", "chart-svg")
    .style( "pointer-events", "none")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var majors = [];

  var i = 0;

  // create objects with arrays "college" "year" and "total"
  var currentMajor;

  var maxTotal = 0;

  while ( i < data.length ) {

    // console.log( data[i] );

    if( major === "Colleges" || major === data[i]["College"] ) {
      var index;
      if ( major === "Colleges" ) {
        index = majors.findIndex( m => m.name === data[i]["College"] );
      } else {
        index = majors.findIndex( m => m.name === data[i]["Major Name"] );
      }
      if ( index === -1 ) {
        if ( major === "Colleges" ) {
          majors.push( { name: data[i]["College"], totals : [], years : [] } );
        } else {
          majors.push( { name: data[i]["Major Name"], totals : [], years : [], college : [] } );
        }
      }

      if ( major === "Colleges" ) {
        index = majors.findIndex( m => m.name === data[i]["College"] );
      } else {
        index = majors.findIndex( m => m.name === data[i]["Major Name"] );
      }

      majors[index].totals.push( data[i]["StudentsPer100"] );

      majors[index].years.push( data[i]["Fall"] );
      // majors[index].college.push( data[i]["College"] );

      // console.log(data[i]["StudentsPer100"]);

      if ( data[i]["StudentsPer100"] >= maxTotal ) {
        maxTotal = data[i]["StudentsPer100"];
      }
    }
    i++;

  }

  if ( major === "Colleges") {
    maxTotal = 30;
  }

  console.log( maxTotal );

  // create timescale from 1980 to 2018
  var yearScale = d3.scaleLinear()
    .domain( [1980, 2018] )
    .range( [0, width] );
  // create scale of totals from 0% to 30%
  var totalScale = d3.scaleLinear()
  // .domain( [0, 5] )
  .domain( [0, maxTotal] )
    .range( [height, 0] );
  // create x-axs
  var x_axis = d3.axisBottom()
    .scale( yearScale )
    .ticks(10)
    .tickFormat(d3.format("d"));
  // create y-axis on left
  var y_axis_left = d3.axisLeft()
    .scale(totalScale)
    .tickPadding(0);
  // create y-axis on right
  var y_axis_right = d3.axisRight()
    .scale(totalScale)
    .tickPadding(0);

  // add axis elements
  svg.append("g")
    .call( x_axis )
    .attr("transform", "translate( 0, " + height + " )");

  svg.append("g")
    .call( y_axis_left.ticks(15).tickFormat( function(d,i){ return d + "%"; }) );

  svg.append("g")
    .attr("transform", "translate( " + width + ", 0 )")
    .call( y_axis_right.ticks(15).tickFormat( function(d,i){ return d + "%"; }) );

  function colorScale(n) {
    var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099",
                    "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395",
                    "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300",
                    "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac", "#f0d"];
    return colors[n % colors.length];
  }

  // create tooltip element
  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // var lineSvg = svg.append("g");

  var symbol = d3.symbol()
              .size(10)
              .type("circle");
              // .style("opacity", 0.9);



  var line = d3.line()
    .x(function(d) { return yearScale(d["Fall"]); })
    .y(function(d) { return totalScale(d["PercentPop"]); })


  svg.selectAll("grade")
    .data(majors)
    .enter()
    .append("line")
    .style("stroke",function(d, i) {
      return colorScale(i);
    })
    .style("stroke-linecap", "round")
    .attr("stroke-width", 5)
    .attr("stroke-opacity", 0.4)
    .style( "pointer-events", "all")
    .attr("x1", function(d) {
      return yearScale( d.years[0] );
    })
    .attr("y1", function(d) {
      return totalScale( d.totals[0] );
    })
    .attr("x2", function(d) {
      // return yearScale( d.years[ d.years.length - 1] );
      return yearScale( d.years[0] );

    })
    .attr("y2", function(d) {
      // return totalScale( d.totals[ d.totals.length - 1] );
      return totalScale( d.totals[0] );

    })
    .on("mouseover", function(d, i) {
      var index = 0;
      svg.selectAll("colleges")
        .data(d["totals"])
        .enter()
        .append("line")
        .attr('class','colleges')
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("stroke-opacity", 1)
        .attr("x1", function(e, j) {
          return yearScale( d["years"][j] );
        })
        // .attr("cx",
        .attr("y1", function(e, j){
          // console.log(slopePoints( yearScale(d.years[0]), d.totals[0], yearScale(d.years[ d.years.length - 1]), d.totals[ d.totals.length - 1], yearScale(d["years"][j]) ));
          return totalScale(d.totals[0]) + slopePoints( yearScale(d.years[0]), totalScale(d.totals[0]), yearScale(d.years[ d.years.length - 1]), totalScale(d.totals[ d.totals.length - 1]), yearScale(d["years"][j]) );
          // return totalScale(d["totals"][j]);
        })
        .attr("x2", function(e, j) {
          if ( j >= d["years"].length - 1 ) j = j-1;
          return yearScale( d["years"][j + 1] );
        })
        // .attr("cx",
        .attr("y2", function(e, j){
          if ( j >= d["years"].length - 1 ) j = j -1;
          return totalScale(d.totals[0]) + slopePoints( yearScale(d.years[0]), totalScale(d.totals[0]), yearScale(d.years[ d.years.length - 1]), totalScale(d.totals[ d.totals.length - 1]), yearScale(d["years"][j + 1]) );
          // return totalScale(d["totals"][j + 1]);
        }).transition()
          .duration(300 * transitions)
          .attr("y1", function(e, j){
            return totalScale(d["totals"][j]);
          })
          .attr("y2", function(e, j){
            if ( j >= d["years"].length - 1 ) j = j -1;
            return totalScale(d["totals"][j + 1]);
          })
;

      div.transition()
        .duration(50)
        .style("opacity", .9);
              // path.attr("stroke-opacity", 0.9)
      var start = parseFloat(d.totals[0]).toFixed(3);
      var end = parseFloat(d.totals[ d.totals.length - 1]).toFixed(3);
      d3.select("line").attr("stroke-opacity", 0.9)
      d3.select(this).attr("stroke-opacity", 0.9)
      d3.select(this).attr("stroke-width", 10)
      div.html(d.name + "<br>" + d.years[0] + " to " + d.years[d.years.length -1] + "<br>" + start + "% to " + end + "%" )
        .style("left", (d3.event.pageX + 16) + "px")
        .style("top", (d3.event.pageY + 16) + "px")
    })
    .on("mouseout", function(d) {
      svg.selectAll(".colleges").remove();

      div.transition()
        .duration(20)
        .style("opacity", 0);
      d3.select(this).attr("stroke-opacity", 0.4)
      d3.select(this).attr("stroke-width", 5)

      div.style("left", "-100px")
         .style("top", "-100px");
    })
    .transition()
    .duration(1000 * transitions)
    .attr("x2", function(d) {
      return yearScale( d.years[ d.years.length - 1] );
    })
    .attr("y2", function(d) {
      return totalScale( d.totals[ d.totals.length - 1] );
    });

}

function slopePoints( startX, startY, endX, endY, x ) {
  return x * ( (startY - endY) / (startX - endX ));
}
