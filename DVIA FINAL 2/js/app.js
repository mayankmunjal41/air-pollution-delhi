import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import scrollama from "https://unpkg.com/scrollama@2.2.1/build/scrollama.js";

// Load data from JSON file
d3.json('data/chart2.json').then((data) => {
  var width = 1400,
    height = 495,
    radius = 6;

  var svg = d3.select("#app")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

  // Define the color scale for different pm value buckets
  var colorScale = d3.scaleThreshold()
    .domain([12, 35.4, 55.4, 150.4, 250.4, 350.4, 500])
    .range(['#c5d86d', '#c5d86d', '#ffba08', '#e85d04', '#d00000', '#6a040f', '#6a040f']);

  // Transform data into nodes format expected by force simulation
  var nodes = data.map(d => ({ x: width / 2, y: height / 2, data: d }));

  // Create circles for each painting
  var circles = svg.selectAll(".pm25")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "pm25")
    .attr("r", radius)
    .style("fill", "#ccc") // Initial color is grey
    .on("mouseover", (event, d) => handleMouseOver(event, d))
    .on("mouseout", handleMouseOut);

  // Create X and Y force for visualisation
  var forceXCombine = d3.forceX(width / 2).strength(0.05);

  // Y axis for all
  var forceYCombine = d3.forceY(height / 2).strength(0.05);

  // Use force simulation
  var simulation = d3.forceSimulation(nodes)
    .force("x", forceXCombine)
    .force("y", forceYCombine)
    .force("collide", d3.forceCollide(radius + 1.5));

  // Tick function to update circle positions
  function ticked() {
    circles
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  // Set up tick event
  simulation.nodes(nodes)
    .on('tick', ticked);

  // Initialize scrollama
  var scroller = scrollama();

  // Setup the instance, pass callback functions
  scroller
    .setup({
      step: ".scroll-step",
      offset: 0.8, // 80% of the viewport
      progress: true,
    })
    .onStepEnter(handleStepEnter);

  // Tooltip functions
  function handleMouseOver(event, d) {
    // Show tooltip with pm_all value
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html("PM Value: " + d.data.pm_all)
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px");
  }

  function handleMouseOut() {
    // Hide tooltip
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  }

  // Scrollama step enter callback
  function handleStepEnter(response) {
    // Check if the current step is active
    if (response.direction === "down") {
      // Update circle colors based on the color scale
      circles.style("fill", d => colorScale(d.data.pm_all));
    } else {
      // If scrolling up, reset colors to grey
      circles.style("fill", "#ccc");
    }
  }

  // Create a tooltip div
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
});
