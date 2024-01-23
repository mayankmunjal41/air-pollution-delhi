//Parse the json file in the document
d3.json("json/portraits.json", function(data) {
    // console.log(data);
    
    // Create variables for width height and radius
    var width = 1400,
        height = 495,
        radius = 6;
        
    var xAxis = d3.axisTop()
      // .scale(x)
    
    var yAxis = d3.axisLeft()
      // .scale(y)
    
    // Create SVG to append into html file    
      var svg = d3.select("#interactive_visualization")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
    // <image height="1" width="1" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clip"></image>   
      var defs= svg.append("defs");
        defs.append("pattern")
          .append("clipPath")
          .attr ("id","picture")
          .attr("width","100%")
          .attr("height","100%")
          .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("width","1")
          .attr("height","1")
          .attr("preserveAspectRatio","none")
          .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
          .attr("xlink:href","d['Image'] + '.jpg'")
          // .attr("xlink:href","images/1.jpg")
    
      //Create x axis   
      var xAxisg=svg  
        .append("g")
        .attr("transform","translate(0,480)")
      
      //Create y axis  
      var yAxisg=svg
        .append("g")
        .attr("transform","translate(100,0)")
        
    //Give Colour Domains
    var color = d3.scaleOrdinal()
          .domain(["Male-Exterior", "Male-Interior", "Male-Unknown", "Female-Exterior", "Female-Interior", "Female-Unknown","Anonymous-Exterior", "Anonymous-Interior", "Anonymous-Unknown" ])
          .range(["#AECAE6", "#73A8D3", "#007FBB", "#F9C8D1","#F283A1","#EC0774", "#B5B2AC", "#84837D", "#60605B" ]);
    
    
    //Draw the Ellipse
    var ellipse = svg.append("ellipse")
                            .attr("cx", 1225)
                            .attr("cy", 225)
                            .attr("rx", 100)
                            .attr("ry", 100)
                            .style('fill', 'none')
                            .style('stroke', '#d1d3d4')
                            .style('stroke-width', '2')
                            .attr("id", "mirror");
    
    // var square =  svg.append("rect")
    //                           .attr("x", 1200)
    //                           .attr("y", 100)
    //                           .attr("width", 150)
    //                           .attr("height", 200)
    //                           .style('fill', 'url(#picture)')
    //                           .style('stroke', '#d1d3d4')
    //                           .style('stroke-width', '2')
    //                           .attr("id", "mirror");
    
    
    // Create X and Y force for Visualisation
      var forceXCombine = d3.forceX(width/2).strength(0.05)
      
      // time x axis
       var forceXTime = d3.forceX(function(d) {
        // console.log(d);
          if(d.Date >= 1400 && d.Date <1500){
            return 200
          } else if (d.Date >= 1500 && d.Date <1600) {
            return 300
          } else if (d.Date >= 1600 && d.Date <1700){
            return 450
          }else if (d.Date >= 1700 && d.Date <1800){
            return 650
          }else if (d.Date >= 1800 && d.Date <1900){
            return 875
          }else if (d.Date >= 1900 && d.Date <2000){
            return 1050
          } else {
            return 0
          }
        }).strength(0.05)
        
      
      // y axis for all  
      var forceYCombine = d3.forceY(height/2).strength(0.05) 
      
      // Create Y force for Gender
        var forceYGender = d3.forceY(function(d) {
          if(d.Artist_Gender === 'Female'){
                return 75
              } else if (d.Artist_Gender === 'Male') {
                return 225
              } else if (d.Artist_Gender === 'Anonymous'){
                return 375
              }
            }).strength(0.05)
        
      // Create Y force for Clothing 
      var forceYClothing = d3.forceY(function(d) {
          if(d.Subject_Clothing === 'Dressed'){
                return 100
              } else if (d.Subject_Clothing === 'Nude'){
                return 300
              }
            }).strength(0.05)
    
    // Create Y force for Painting Location
      var forceYLocation = d3.forceY(function(d) {
          if(d.Subject_Location === 'Interior') {
                return 75
              } else if (d.Subject_Location === 'Unknown'){
                return 225
              } else if (d.Subject_Location === 'Exterior'){
                return 375
              } else {
                return 600
              }
            }).strength(0.05)
    
    // Create Y force for Subject Sight
      var forceYSight = d3.forceY(function(d) {
          if(d.Subject_Sight === 'LookingAt') {
                return 100
              } else if (d.Subject_Sight === 'LookingAway'){
                return 300
              }
            }).strength(0.05)
        
    // Create Y force for Subject Activity
      var forceYActivity = d3.forceY(function(d) {
          if(d.Subject_Activity === 'Potrait') {
                return 100
              } else if (d.Subject_Activity === 'Activity'){
                return 300
              }
            }).strength(0.05)
        
    // Use force simulation    
        var simulation = d3.forceSimulation()
          .force("x", forceXCombine)
          .force("y", forceYCombine)
          .force("collide", d3.forceCollide(radius + 1.5))
    
    // Create circles for Each Paining  
        var circles = svg.selectAll(".Each_Painting")
          .data(data)
          .enter().append("circle")
          .attr("class", ".Each_Painting")
          .attr("r", radius)
          .style("fill", function(d,i) {
                    // console.log(d)
                      return color(d.Filter_1);
                  });
          
    
    // Create on click for visualization    
        d3.select("#visualization").on('click', function(){
          simulation
            .force("x", forceXTime.strength(0.1))
            .force("y", forceYCombine.strength(0.1))
            .alphaTarget(0.1)
            .restart()
             // console.log('click')
          
          var y = d3.scaleOrdinal()
                          .domain (["Time"])
                          .range ([250])
                  // console.log(yAxis, yAxisg)        
                  yAxis = yAxis.scale(y)
                  yAxisg.call(yAxis)
                  
                  .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
            
          
          var x = d3.scaleOrdinal()
                          .domain (["15 Century", "16 Century", "17 Century", "18 Century", "19 Century", "20 Century"])
                          .range ([200, 300, 450, 650, 875, 1050])
                    // console.log(xAxis, xAxisg)        
                    xAxis = xAxis.scale(x)
                    xAxisg.call(xAxis)
                    
                    .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
        })
    
    // Create on click for gender    
        d3.select("#gender").on('click', function(){
          simulation
            .force("x", forceXTime.strength(0.1))
            .force("y", forceYGender.strength(0.1))
            .alphaTarget(0.1)
            .restart()
            // console.log('click')
          
            // y axis
            var y = d3.scaleOrdinal()
                          .domain (["Female", "Male", "Anonymous"])
                          .range ([75, 225, 375])
                  // console.log(yAxis, yAxisg)        
                  yAxis = yAxis.scale(y)
                  yAxisg.call(yAxis)
                  
                  .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
            
            // x axis      
            var x = d3.scaleOrdinal()
                          .domain (["15 Century", "16 Century", "17 Century", "18 Century", "19 Century", "20 Century"])
                          .range ([200, 300, 450, 650, 875, 1050])
                    // console.log(xAxis, xAxisg)        
                    xAxis = xAxis.scale(x)
                    xAxisg.call(xAxis)
                    
                    .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
                    
                    
        })
        
    
    // Create on click for clothing     
        d3.select("#clothing").on('click', function(){
              simulation
                .force("x", forceXTime.strength(0.1))
                .force("y", forceYClothing.strength(0.1))
                .alphaTarget(0.1)
                .restart()
              // console.log('click')
            
            // y axis  
            var y = d3.scaleOrdinal()
                          .domain (["Dressed", "Nude"])
                          .range ([100, 300])
                  // console.log(yAxis, yAxisg)        
                  yAxis = yAxis.scale(y)
                  yAxisg.call(yAxis)
                  
                  .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
            
            // x axis      
            var x = d3.scaleOrdinal()
                          .domain (["15 Century", "16 Century", "17 Century", "18 Century", "19 Century", "20 Century"])
                          .range ([200, 300, 450, 650, 875, 1050])
                    // console.log(xAxis, xAxisg)        
                    xAxis = xAxis.scale(x)
                    xAxisg.call(xAxis)
                    
                    .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
            })
    
    // Create on click for location          
        d3.select("#location").on('click', function(){
                  simulation
                    .force("x", forceXTime.strength(0.1))
                    .force("y", forceYLocation.strength(0.1))
                    .alphaTarget(0.1)
                    .restart()
                  // console.log('click')
          
          // y axis         
          var y = d3.scaleOrdinal()
                          .domain (["Interior", "Unknown", "Exterior"])
                          .range ([75, 225, 375])
                  // console.log(yAxis, yAxisg)        
                  yAxis = yAxis.scale(y)
                  yAxisg.call(yAxis)
                  
                  .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
            
          
          // x axis        
          var x = d3.scaleOrdinal()
                          .domain (["15 Century", "16 Century", "17 Century", "18 Century", "19 Century", "20 Century"])
                          .range ([200, 300, 450, 650, 875, 1050])
                    // console.log(xAxis, xAxisg)        
                    xAxis = xAxis.scale(x)
                    xAxisg.call(xAxis)
                    
                  .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
            
                })
    
    // Create on click for object sight              
        d3.select("#sight").on('click', function(){
                  simulation
                    .force("x", forceXTime.strength(0.1))
                    .force("y", forceYSight.strength(0.1))
                    .alphaTarget(0.1)
                    .restart()
                  // console.log('click')
          
          // y axis        
          var y = d3.scaleOrdinal()
                          .domain (["Looking At", "Looking Away"])
                          .range ([100, 300])
                  // console.log(yAxis, yAxisg)        
                  yAxis = yAxis.scale(y)
                  yAxisg.call(yAxis)
          
                  .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
                        .call(wrap, 75);
          // x axis
          var x = d3.scaleOrdinal()
                          .domain (["15 Century", "16 Century", "17 Century", "18 Century", "19 Century", "20 Century"])
                          .range ([200, 300, 450, 650, 875, 1050])
                    // console.log(xAxis, xAxisg)        
                    xAxis = xAxis.scale(x)
                    xAxisg.call(xAxis)
                    
                    .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
                })   
    
    // Create on click for activity            
        d3.select("#activity").on('click', function(){
                  simulation
                    .force("x", forceXTime.strength(0.1))
                    .force("y", forceYActivity.strength(0.1))
                    .alphaTarget(0.1)
                    .restart()
                  // console.log('click')
          
          // y axis        
          var y = d3.scaleOrdinal()
                          .domain (["Posing", "Indulged in Activity"])
                          .range ([100, 300])
                  // console.log(yAxis, yAxisg)        
                  yAxis = yAxis.scale(y)
                  yAxisg.call(yAxis)
                  
                  .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
                        .call(wrap, 75);
          // x axis        
          var x = d3.scaleOrdinal()
                          .domain (["15 Century", "16 Century", "17 Century", "18 Century", "19 Century", "20 Century"])
                          .range ([200, 300, 450, 650, 875, 1050])
                    // console.log(xAxis, xAxisg)        
                    xAxis = xAxis.scale(x)
                    xAxisg.call(xAxis)
                    
                    .selectAll("text")
                        .style("fill", "#353730")
                        .attr("font-family",  "LeagueSpartan")
                })  
       
      simulation.nodes(data)
      .on('tick', ticked)
      
      
      svg.selectAll('circle')
        .data(data)
        .attr('r', 6)
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", d['Image'] + '.jpg');
          
         // add image 
          // var myimage = svg.append('image')
          //   .attr('xlink:href', d['Image'] + '.jpg')
          //   .attr('width', 200)
          //   .attr('height', 200)
          //   .attr("transform","translate(1175,100)")
          //   // .attr('clip-path','mirror')
          //   .style('visibility', 'visible')
          //   .attr("id", "clip");
            
          var myimage = svg.append('image')
            .attr('xlink:href', d['Image'] + '.jpg')
            .attr('width', 250)
            .attr('height', 250)
            .attr("transform","translate(1100,100)")
            // .attr('clip-path','mirror')
            .style('visibility', 'visible')
            .attr("id", "clip_1")
            .style("opacity", "1");
            
          // var mycaption = svg.append('text')
          //   .text( d['Painting_Name'])
          //   .attr('x', 0)
          //   .attr('y', 200)
          //   .attr('fill', 'red')
          //   .attr('class', 'caption')
          //   // .attr("transform","translate(1100,100)")
          //   .style('visibility', 'visible');  
    
        // make circle bigger
          d3.select(this)
            .transition()
            .duration(100)
            .attr('r', 25)
            // .attr('fill', 'red');
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseout", this);
    
          // return to normal
          d3.select(this)
            .transition()
            .duration(100)
            .attr('r', 6)
            .attr('fill', '#000000');
         
          svg.selectAll('image')
            .style('visibility', 'hidden');
            
          // svg.select('caption')
          //   .style('fill', '#000000' )
          //   .style('visibility', 'hidden');
                // .style('background', '#000000');
        })
    
        // on click go to link
        .on('click', function(d,i){
          // console.log("click");
          // window.location = d['Link'], '_blank';
          window.open(d['Link']);
        })    
          
      
      function ticked(){
        circles
        .attr("cx", function(d){
         return d.x 
        })
        .attr("cy", function(d){
         return d.y 
        })
      }
      
      function range(x, min, max) {
      return x >= min && x <= max;
      }
      
      function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }
          
    })
      
        
        
        
        