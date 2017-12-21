function diff_interactive_chart(){
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.area()
      .interpolate("basis")
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d["n_homens"]); });

  area = d3.svg.area()
      .interpolate("basis")
      .x(function(d) { return x(d.date); })
      .y1(function(d) { return y(d["n_homens"]); });

  var svga = d3.select("#diff-chart-interativo").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("data/diff_char.json", function(error, data) {
    if (error) throw error;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var todayMillis = today.getTime();

    data.forEach(function(d) {
      var parts = d.date.split(":");
      var timePeriodMillis = (parseInt(parts[0], 10) * 60 * 60 * 1000) +
        (parseInt(parts[1], 10) * 60 * 1000);

      d.date = new Date();
      d.date.setTime(todayMillis + timePeriodMillis);

      d["n_homens"]= +d["n_homens"];
      d["n_mulheres"] = +d["n_mulheres"];
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
      d3.min(data, function(d) { return Math.min(d["n_homens"], d["n_mulheres"]); }),
      d3.max(data, function(d) { return Math.max(d["n_homens"], d["n_mulheres"]); })
    ]);

    svga.datum(data);

    // var clipBelow = svga.append("clipPath")
    //     .attr("id", "clip-below")
    //   .append("path")
    //     .attr("d", area.y0(height));
    //
    // var clipAbove = svga.append("clipPath")
    //     .attr("id", "clip-above")
    //   .append("path")
    //     .attr("d", area.y0(0));

    var pathAreaAbove = svga.append("path")
        .attr("class", "area above")
        //.attr("clip-path", "url(#clip-above)")
        .attr("d", area.y0(function(d) { return y(d["n_mulheres"]); }));

    var pathAreaBelow = svga.append("path")
        .attr("class", "area below")
        //.attr("clip-path", "url(#clip-below)")
        .attr("d", area)
        .on("click", mostraDiferenca)
        .on("mouseover", mostraTooltip)
        .on("mouseout", escondeTooltip)
        .on("dblclick", mostraOriginal)

    svga.append("path")
        .attr("class", "line")
        .attr("d", line);


    svga.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svga.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Quantidade de pessoas (Pedestres e ciclistas)");

    function mostraDiferenca(d){
      console.log()
      area.y0(height);
      area.y1(function(d) { return y(d["n_homens"]-d["n_mulheres"]); });
      //clipAbove.transition().duration(500).attr("d", area);
      pathAreaBelow.transition().duration(500).attr("d", area).style("fill", "pink");
      pathAreaAbove.remove();
    }

    function mostraTooltip(data){
      var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      d3.select("#tooltip")
        .attr("transform", "translate(" + x(d.date) + "," + y(d.n_homens) + ")");
        .select("text").text(formatCurrency(d.n_homens));
    }

    function escondeTooltip(d){
      d3.select("#tooltip").classed("hidden", true);
    }

    function mostraOriginal(d){
      area.y1(function(d) { return y(d["n_homens"]); });
      area.y0(function(d) { return y(d["n_mulheres"]); });
      pathAreaBelow.transition().duration(500).attr("d", area).style("fill", "MediumPurple");
    }
  });

}
