
// Using jQuery, read our data and call visualize(...) only once the page is ready:
// $(function() {
//   d3.csv("courses-avg-var.csv").then(function(data) {
//     // Write the data to the console for debugging:
//     console.log(data);
//
//     // Call our visualize function:
//     visualize(data);
//   });
// });

var theData = null;

function drawGraph( filters, search ) {
  if ( theData == null ) {
    d3.csv("courses-avg-var.csv").then(function(data) {
      // Write the data to the console for debugging:
      console.log(data);
      theData = data;

      // Call our visualize function:
      visualize(data, filters, search);
    });
  } else {
    visualize(theData, filters, search);
  }
}


// $(window).resize(function () {
//   if (data != null) {
//     var new_width = $("#chart").width();
//     if (cur_width != new_width) {
//       $("#chart").html("");
//       $("div.d3-tip").remove();
//       visualize(data);
//     }
//   }
// });


//161 subjects


var visualize = function(data, filters, search) {
  // Boilerplate:

  var ele = document.getElementById("chart"); // Do not use #
  var eleStyle = window.getComputedStyle(ele);
  /* Below is the width of ele */
  var eleWidth = eleStyle.width;
  var newWidth = parseFloat( eleWidth ) * 0.9;
  console.log( eleWidth );

  var margin = { top: 50, right: 120, bottom: 50, left: 120 },
     width = newWidth - margin.left - margin.right,
     height = (newWidth * 0.95) - margin.top - margin.bottom;

  var svg = d3.select("#chart")
    .append("svg")
    .attr( "id", "chart-svg")

    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style( "pointer-events", "none")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Visualization Code:

  var searching = ( search != null );

  if ( search === null || subjToCollege[ search.subj ] === undefined || isNaN( search.num ) ) {
    // search = { "subj": searchSubject, "num" : searchNumber };
      searching = false
  }
  if (  search !== null && subjToCollege[ search.subj ] !== undefined && search.num === "" ) {
    searching = false;
  }

  console.log( searching );
  // Min and Max GPA
  // var maxgpa = _.max(data, "Average GPA")["Average GPA"];
  var mingpa = _.min(data.map(function(rec) {return rec["Average GPA"]}));
  var minvar = _.min(data.map(function(rec) {return rec["Variance"]}));
  var maxvar = _.max(data.map(function(rec) {return rec["Variance"]}));
  var maxsize = _.max(data.map(function(rec) {return rec["Total Students"]}));


  // var c20 = d3.scale.category20();

  var varianceScale = d3.scaleLinear()
                    .domain( [minvar, maxvar] )
                    .range( [0, width] )
                    .nice();

  var gpaScale = d3.scaleLinear()
                    .domain( [mingpa, 4.0] )
                    .range( [0, height] )
                    .nice();

  var sizeScale = d3.scaleLinear()
                    .domain( [0, maxsize] )
                    .range( [3, 20] );

  var y_axis = d3.axisTop()
               .scale( gpaScale );

  var x_axis = d3.axisLeft()
      .scale( varianceScale );

  var gridlines = d3.axisLeft()        // Same orientation as the axis that needs gridlines
                  .tickFormat("")    // (1): Disable the text for the gridlines
                  .tickSize(-height)  // (2): Extend the tick `width` amount, negative
                   .scale(varianceScale);     // Same scale as the axis that needs gridlines

 var gridlines2 = d3.axisTop()        // Same orientation as the axis that needs gridlines
                 .tickFormat("")    // (1): Disable the text for the gridlines
                 .tickSize(-width)  // (2): Extend the tick `width` amount, negative
                 .scale(gpaScale);     // Same scale as the axis that needs gridlines

 svg.append("g")
   .attr("class", "grid")   // (3): Add a CSS class
   .attr("fill", "red")
   .call(gridlines);



  svg.append("g")
     .attr("class", "grid")   // (3): Add a CSS class
     .call(gridlines2);

   svg.append("text")
     .attr("text-anchor", "start")
     .attr("x", 20)
     .attr("y", 14)
     .text("Average GPA")
     .attr("fill", "black")
     .attr("font-size", "14px")

   svg.append("text")
    .attr("text-anchor", "start")
    .attr("x", 20)
    .attr("y", -2)
    .text("Variance of Grade Distribution")
    .attr("fill", "black")
    .attr("font-size", "14px")
    .attr("transform", "rotate(90)")

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

  svg.append("g")
      .call( y_axis );

  svg.append("g")
     .call( x_axis );

  svg.selectAll( "class" )
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "classes")
    .attr("r", function(d,i) {
      // return sizeScale( d["Total Students"]);
      // return 0;
      if ( filters != null && filters.length > 0) {
        var contains = false;
        filters.forEach(function(subj) {

          if (  d["Subject"] == subj ) {
            contains = true;
          }
        })
        if ( contains ) { return sizeScale( d["Total Students"]); }
        else { return 0; }
      } else {
        return sizeScale( d["Total Students"]);
      }
    })
    .style( "pointer-events", function(d) {
      if ( !searching ) {
        return "all";
      } else {
        if ( search.subj === d["Subject"] && search.num === d["Number"] ) {
          return "all";
        }
        return "none";
      }
    })
    .attr("cx", function(d,i) {
      return gpaScale(d["Average GPA"]);
    })
    .attr("cy", function(d,i) {
      return varianceScale(  d["Variance"] );
    })
    .attr("fill", function(d,i) {
      // console.log(subjectColors[d["Subject"] ]);
      return colors[subjectColors[d["Subject"] ]];
    })
    .attr( "opacity", function(d) {
      if ( !searching ) {
        return 0.7;
      } else {
        if ( search.subj === d["Subject"] && search.num === d["Number"] ) {
          return 1;
        }
        return 0.2;
      }
    })
    .on("mouseover", function(d, i) {


    div.transition()
      .duration(50)
      .style("opacity", .9);
    div.html( d["Subject"] + " " + d["Number"] + " " + d["Course Title"] + "<br>" + "Average GPA: " + parseFloat(d["Average GPA"]).toFixed(2) + "<br>" + "Grade Variance: " + parseFloat(d["Variance"]).toFixed(2) )
      .style("left", (d3.event.pageX + 16) + "px")
      .style("top", (d3.event.pageY + 16) + "px")
  })
  .on("mouseout", function(d) {

  div.transition()
      .duration(20)
      .style("opacity", 0);
    d3.select(this).attr("stroke-opacity", 0.4)
    d3.select(this).attr("stroke-width", 5)

    div.style("left", "-100px")
       .style("top", "-100px");
  });
  // .transition()
  //   .duration(0)
  //  //  .attr("r", function(d) {
  //  //    if ( filters != null && filters.length > 0) {
  //  //      var contains = false;
  //  //      filters.forEach(function(subj) {
  //  //
  //  //        if (  d["Subject"] == subj ) {
  //  //          contains = true;
  //  //        }
  //  //      })
  //  //      if ( contains ) { return sizeScale( d["Total Students"]); }
  //  //      else { return 0; }
  //  //    } else {
  //  //      return sizeScale( d["Total Students"]);
  //  //    }
  //  // })
  //  .attr("opacity", function(d) {
  //    return 0.7
  //  });


  // var allSubjects = {};
  // var counter = 0;
  //Filter data points by subject

  // if ( filters != null && filters.length > 0) {
  //   svg.selectAll(".classes")
  //    .attr("r", function (d) {
  //
  //      var contains = false;
  //      filters.forEach(function(subj) {
  //
  //        if (  d["Subject"] == subj ) {
  //          contains = true;
  //        }
  //      })
  //      if ( contains ) { return sizeScale( d["Total Students"]); }
  //      else { return 0; }
  //
  //   });
  // }

};
