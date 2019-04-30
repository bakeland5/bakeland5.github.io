
// Using jQuery, read our data and call visualize(...) only once the page is ready:
/*
$(function() {

  d3.csv("data_CollegeByYear.csv").then(function(data) {
    // Write the data to the console for debugging:
    // console.log("HELLO");
    // console.log(data);
    // Call our visualize function:
    visualize(data);
  });
});


var visualize = function(data) {
  // Boilerplate:
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
  while ( i < data.length ) {

    var index = majors.findIndex( major => major.name === data[i]["College"] );
    if ( index === -1 ) {
      majors.push( { name: data[i]["College"], totals : [], years : [] } );
    }
    index = majors.findIndex( major => major.name === data[i]["College"] );

    majors[index].totals.push( data[i]["PercentPop"] );
    majors[index].years.push( data[i]["Fall"] );
    i++;


  }


  console.log( majors );

  // create timescale from 1980 to 2018
  var yearScale = d3.scaleLinear()
    .domain( [1980, 2018] )
    .range( [0, width] );
  // create scale of totals from 0% to 30%
  var totalScale = d3.scaleLinear()
    .domain( [0, 30] )
    .range( [height, 0] )

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


  function colorScale(n) {
    var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099",
                    "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395",
                    "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300",
                    "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac", "#f0d"];
    return colors[n % colors.length];
  }

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
          return totalScale(d["totals"][j]);
        })
        .attr("x2", function(e, j) {
          if ( j >= d["years"].length - 1 ) j = j-1;
          return yearScale( d["years"][j + 1] );
        })
        // .attr("cx",
        .attr("y2", function(e, j){
          if ( j >= d["years"].length - 1 ) j = j -1;
          return totalScale(d["totals"][j + 1]);
        });


      div.transition()
        .duration(20)
        .style("opacity", .9);
              // path.attr("stroke-opacity", 0.9)

      var start = parseFloat(d.totals[0]).toFixed(3);
      var end = parseFloat(d.totals[ d.totals.length - 1]).toFixed(3);
      d3.select("line").attr("stroke-opacity", 0.9)
      d3.select(this).attr("stroke-opacity", 0.9)
      d3.select(this).attr("stroke-width", 20)
      div.html("College of " + d.name + "<br>" + d.years[0] + " to " + d.years[d.years.length -1] + "<br>" + start + "% to " + end + "%")
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
    .duration(1000)
    .attr("x2", function(d) {
      return yearScale( d.years[ d.years.length - 1] );
    })
    .attr("y2", function(d) {
      return totalScale( d.totals[ d.totals.length - 1] );
    });

}
*/
