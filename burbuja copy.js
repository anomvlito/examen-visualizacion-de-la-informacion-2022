
const width = 2000
const height = 1000

const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

function make_tarea(data) {
  
  const color = d3.scaleOrdinal()
    .domain(["Analista", "Diplomatico", "Explorador", "Sentinela"])
    .range(["rgb(162, 25, 255)", "rgb(0,255,0)", "rgb(255,255,0)", "rgb(64,224,208)"]);

  
  const size = d3.scaleLinear()
    .domain([0, 15439])
    .range([3,60]) 
  
  const mouseover = function(event, d) {
    var textito = svg.append("text")
      .attr('id',"chart")
      .attr('x',event.x )
      .attr('y', event.y)
      .style("font-size", "20px")
      .style("background-color", "blue")
      .style("font-weight", "bold")
      .style("text-shadow","0 0 5px #fff")
      .text( d.character_name + "-"+ d.mbti +  "\n " +"Votos:" + d.vote_count ) 
      .attr("fill", "blue")   
      }
  const mousemove = function(event, d) {
    d3.selectAll("#chart").attr('x', d.x)
    .attr('y', d.y)
    }
  var mouseleave = function(event, d) {
    d3.selectAll("#chart").style("opacity", 0)
  }
  var handleClick = function(event, d){
    console.log(event,d)}

  
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("id", "chart2")
      .attr("class", "node")
      .attr("r", d => size(d.vote_count))
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", d => color(d.grupo))
      .style("fill-opacity",1)
      .attr("stroke", "white")
      .style("stroke-width", 1)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("click", handleClick)
      .call(d3.drag() 
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));
    
    
    
  
  const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2))
      .force("charge", d3.forceManyBody().strength(.1)) 
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.vote_count)+3) }).iterations(1)) // Force that avoids circle overlapping

  
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
      });

  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

}

const  valorcito = d3.select("#orderBy").on("change", (event) => {
  d3.selectAll("#chart2").transition().duration(1500)
  .attr("r", 0).remove()

  runCode(parseInt(event.target.value))
  
  console.log(event.target.value)
  return parseInt( event.target.value)})

function runCode(valor) {
 
    const URL1= "https://raw.githubusercontent.com/anomvlito/visualizacion-de-la-informacion-2022/main/animes.csv"
    
    d3.csv(URL1).then(function(data){

      
      data = data.filter(function(d){ return d.vote_count >  valor });
      
      make_tarea(data);

      
    



      })


      
     
  }


runCode(1000);