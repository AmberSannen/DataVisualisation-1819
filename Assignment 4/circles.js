(function () {
  var width = 900,
    height = 500;

  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)")


  var radiusScale = d3.scaleSqrt().domain([111685, 273793]).range([10, 80]);

  var forceXSeperate = d3.forceX(function (d) {
    if (d.decade === 'pre-2010') {
      return 200
    } else {
      return 800
    }
  }).strength(0.05)

  var forceXCombine = d3.forceX(width / 2).strength(0.05)



  var forceY = d3.forceY(function (d) {
    return height / 2
  }).strength(0.05)

  var forceCollide = d3.forceCollide(function (d) {
    return radiusScale(d.amount) + 1;
  })

  var simulation = d3.forceSimulation()
    .force("x", forceXCombine)
    .force("y", forceY)
    .force("collide", forceCollide)

  d3.queue()
    .defer(d3.csv, "names.csv")
    .await(ready)

  function ready(error, datapoints) { //creating circles
    var circles = svg.selectAll(".people")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "person")
      .attr("r", function (d) {
        //console.log(d)
        return radiusScale(d.amount);
      })
      .attr("fill", function (d) {
        if (d.amount <= 1) {
          return "#ffcc99"
        } else if (d.amount > 1 && d.amount <= 110000) {
          return "#cfcfcf"
        } else if (d.amount > 110000 && d.amount <= 150000) {
          return "#848e97"
        } else if (d.amount > 150000 && d.amount <= 200000) {
          return "#636f88"
        } else if (d.amount > 200000 && d.amount <= 250000) {
          return "#8b7982"
        } else if (d.amount > 250000 && d.amount <= 300000) {
          return "#99514d"
        }
      }).on('click', function (d) {
        //console.log(d)
      })



    var labels = svg.selectAll(".people-label")
      .data(datapoints)
      .enter().append("text")
      .attr("class", "people-label")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("font-size", "12px")
      .text(function (d) {
        return d.name;
      })

    d3.select("#decade").on('click', function () {
      simulation
        .force("x", forceXSeperate)
        .alphaTarget(0.70)
        .restart()
    })

    d3.select("#combine").on('click', function () {
      simulation
        .force("x", forceXCombine)
        .alphaTarget(0.40)
        .restart()
    })


    simulation.nodes(datapoints)
      .on('tick', ticked)

    function ticked() {
      circles
        .attr("cx", function (d) {
          return d.x
        })
        .attr("cy", function (d) {
          return d.y
        })

      labels
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y;
        })
    }


  }
})();