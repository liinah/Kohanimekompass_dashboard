
const margin = 20;
const width = window.innerWidth - margin * 2;
const height = 1200;
const infoPanel = document.getElementById("info-panel");
const closePanelButton = document.getElementById("close-panel");

const tourHasBeenSeen = localStorage.getItem("tourSeen");

let selectedBubbleRef = null; 




const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "white")
    .style("display", "block")
    .style("margin", "0 auto");

const defs = svg.append("defs");

const zoomLayer = svg.append("g");


svg.on("click", function (event) {

    if (event.target.tagName !== "circle" && event.target.tagName !== "text") {
        resetBubbleStyles(); 
    }
});




document.getElementById("kompass-btn").addEventListener("click", () => {
    document.getElementById("kompass-btn").classList.add("active");
    document.getElementById("lisainfo-btn").classList.remove("active");

});

document.getElementById("lisainfo-btn").addEventListener("click", () => {
    document.getElementById("lisainfo-btn").classList.add("active");
    document.getElementById("kompass-btn").classList.remove("active");

});

document.addEventListener("DOMContentLoaded", () => {
    const infoPanel = document.getElementById("info-panel");
    infoPanel.style.flex = "0"; 
});



function highlightBubble(selectedBubble) {
    const bubbles = zoomLayer.selectAll("circle");
    const labels = zoomLayer.selectAll("text");


    bubbles.style("opacity", 0.4).style("stroke", "none");
    labels.style("opacity", 0.3);


    d3.select(selectedBubble)
        .style("opacity", 1)
        .style("stroke", "black")
        .style("stroke-width", 0);

    d3.select(selectedBubble.parentNode).select("text").style("opacity", 1);

    selectedBubbleRef = selectedBubble;
}

function resetBubbleStyles() {
    zoomLayer.selectAll("circle").style("opacity", 1).style("stroke", "none");
    zoomLayer.selectAll("text").style("opacity", 1);
    selectedBubbleRef = null;
  

    if (selectedLegendCategories.size === 0) {
      zoomLayer.selectAll("circle").style("opacity", 1).style("stroke", "none");
      zoomLayer.selectAll("text").style("opacity", 1);
    } else {
      updateBubbleVisibility(); 
    }
  }




function centerOnBubble(d) {

    const currentTransform = d3.zoomTransform(zoomLayer.node());

    const bx = d.staticX;
    const by = d.staticY;
    

    const chartRect = document
      .getElementById("chart-container")
      .getBoundingClientRect();
    const cx = chartRect.width / 2;
    const cy = chartRect.height / 2;
    

    const finalX = cx - bx * currentTransform.k;
    const finalY = cy - by * currentTransform.k;
    

    zoomLayer
      .transition()
      .duration(750)
      .attr(
        "transform",
        `translate(${finalX},${finalY}) scale(${currentTransform.k})`
      );
  }
  





function updateDynamicFacts(name, count, allCounts) {

    document.getElementById("fact-name").textContent = name;
    document.getElementById("fact-count").textContent = count;

    const sortedCounts = [...allCounts].sort((a, b) => b - a);


    const rank = sortedCounts.indexOf(count) + 1;


    document.getElementById("fact-popularity").textContent = `${rank}.`;
}



function handleBubbleClick(event, d) {
    const name = d.l_aadress; 
    const count = d.count; 
    const allCounts = data.map((d) => d.count); 


    updateDynamicFacts(name, count, allCounts);


    highlightBubble(event.target);
    openInfoPanel();
    showMap(name);

    setTimeout(() => {
        centerOnBubble(d);
      }, 400); 
}






let wasLegendOpen = false; 

function openInfoPanel() {
  const wasLegendOpen = document.getElementById("legend-toggle").checked;
  
  if (wasLegendOpen) {
    fadeOutLegend(); 
  }


  const chartContainer = document.getElementById("chart-container");
  const infoPanel = document.getElementById("info-panel");
  chartContainer.style.flex = "1";
  infoPanel.style.flex = "2";
}



document.getElementById("close-panel").addEventListener("click", closeInfoPanel);






  



function updateTextVisibility(zoomLevel) {
    zoomLayer.selectAll("text").each(function (d) {
        const textNode = d3.select(this);

        if (
            (d.count >= 400 && zoomLevel >= 0.5) || 
            (d.count >= 200 && zoomLevel >= 1) ||
            (d.count >= 100 && zoomLevel >= 2) || 
            (d.count < 100 && zoomLevel >= 4) 
        ) {
            textNode.style("display", "block");
        } else {
            textNode.style("display", "none");
        }
    });
}

const zoom = d3.zoom()
    .scaleExtent([0.5, 10])
    .translateExtent([[-1000, -1000], [width + 1000, height + 1000]]) 
    .on("zoom", (event) => {
        zoomLayer.attr("transform", event.transform); 
        zoomLayer.selectAll("text").attr("transform", `scale(${1 / event.transform.k})`); 
        updateTextVisibility(event.transform.k); 
    });

svg.call(zoom); 







const legendCategories = [
    { id: "Mets",        label: "Metsad, salud ja puud",       color: "#5a823f" },
    { id: "Lill",      label: "Lilled, söögiannid ja muu floora", color: "#c2c08f" },
    { id: "Põld",        label: "Põllud ja põllumajandus, rohumaad, karjamaad ja muud avarad alad", color: "#a28850" },
    { id: "Vesi",        label: "Veekogud, veetaimed ja märjad alad (sh sood)",      color: "#28707f" },
    { id: "Reljeef",     label: "Mäed, orud ja muud pinnavormid",               color: "#b47a67" },
    { id: "Paiknemine",  label: "Kuju või paiknemine millegi suhtes",      color: "#e499b7" },
    { id: "Funktsioon",  label: "Ametid või funktsioonid",      color: "#a62c38" },
    { id: "Pinnas",      label: "Pinnaseomadused",              color: "#342833" },
    { id: "Nimi",        label: "Inimeste nimed",               color: "#633c5f" },
    { id: "Lind",        label: "Linnud",                       color: "#db6048" },
    { id: "Loom",        label: "Loomad",                       color: "#204057" },
    { id: "Muu",         label: "Muu (sh mitu tähendust või tähendus ebaselge)",           color: "#c1bab4" }
  ];
  

  let selectedLegendCategories = new Set(); 


  
  function buildLegend() {
    const legendRows = d3.select("#legend-rows");
  
    legendRows.selectAll("*").remove();
  

    const rows = legendRows.selectAll(".legend-row")
      .data(legendCategories)
      .enter()
      .append("div")
      .attr("class", "legend-row")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-bottom", "5px")
      .style("opacity", 0);  
  

    rows.append("div")
      .style("width", "16px")
      .style("height", "16px")
      .style("margin-right", "8px")
      .style("border", "1px solid #ccc")
      .style("background-color", d => d.color);
  

    rows.append("span")
      .text(d => d.label)
      .style("font-family", "'Poppins', sans-serif")
      .style("font-size", "14px")
      .style("font-weight", "200")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        toggleCategory(d.id);
      });
  

    rows.transition()
      .delay((d, i) => i * 100)  
      .duration(300)
      .style("opacity", 1);
  }
  





  function fadeInLegend() {

    buildLegend();
  }
  
  function fadeOutLegend() {

    const rows = d3.select("#legend-rows").selectAll(".legend-row");
    
    rows
      .transition()
      .delay((d, i) => i * 100)
      .duration(300)
      .style("opacity", 0)
      .on("end", function(d, i) {
        if (i === rows.size() - 1) {
          d3.select("#legend-rows").selectAll("*").remove();
        }
      });
  }
  


document.getElementById("legend-toggle").addEventListener("change", (e) => {
  if (e.target.checked) {
    fadeInLegend();
  } else {
    fadeOutLegend();
  }
});






function toggleCategory(catId) {

  
    if (selectedLegendCategories.has(catId)) {
      selectedLegendCategories.delete(catId);
    } else {
      selectedLegendCategories.add(catId);
    }
    updateBubbleVisibility();
    updateLegendStyle();
  }
  
  function updateBubbleVisibility() {
    if (selectedLegendCategories.size === 0) {
      zoomLayer.selectAll("circle")
        .transition().duration(300)
        .style("opacity", 1)
        .style("pointer-events", "auto");
      zoomLayer.selectAll("text")
        .transition().duration(300)
        .style("opacity", 1);
      return;
    }
  
    zoomLayer.selectAll("circle")
      .transition().duration(300)
      .style("opacity", d => {
        if (selectedLegendCategories.has(d.category_1) || selectedLegendCategories.has(d.category_2)) {
          return 1;
        } else {
          return 0;
        }
      })
      .style("pointer-events", d => {
        if (selectedLegendCategories.has(d.category_1) || selectedLegendCategories.has(d.category_2)) {
          return "auto";
        } else {
          return "none";
        }
      });
  
    zoomLayer.selectAll("text")
      .transition().duration(300)
      .style("opacity", d => {
        if (selectedLegendCategories.has(d.category_1) || selectedLegendCategories.has(d.category_2)) {
          return 1;
        } else {
          return 0;
        }
      });
  }
  
  function updateLegendStyle() {
    if (selectedLegendCategories.size === 0) {
      d3.selectAll(".legend-row")
        .transition().duration(200)
        .style("opacity", 1);
      return;
    }
  
    d3.selectAll(".legend-row")
      .transition().duration(200)
      .style("opacity", d => selectedLegendCategories.has(d.id) ? 1 : 0.2);
  }
  













const categoryColors = {
    "Mets": "#5a823f",
    "Põld": "#a28850",
    "Vesi": "#28707f",
    "Reljeef": "#b47a67",
    "Nimi": "#633c5f",
    "Funktsioon": "#a62c38",
    "Pinnas": "#342833",
    "Paiknemine": "#e499b7",
    "Muu": "#c1bab4",
    "Lill": "#c2c08f",
    "Loom": "#204057",
    "Lind": "#db6048"
};


let data = [];


d3.csv("names2.csv").then(loadedData => {
    loadedData.forEach(d => {
        d.count = +d.count; 
    });

    data = loadedData;


    const radiusScale = d3.scaleSqrt()
        .domain([d3.min(data, d => d.count), d3.max(data, d => d.count)])
        .range([5, 65]);

    data.forEach(d => {
        d.r = radiusScale(d.count);
    });


    const searchContainer = document.createElement("div");
    searchContainer.id = "search-recommendations";
    searchContainer.style.position = "absolute";
    searchContainer.style.background = "white";
    searchContainer.style.border = "1px solid #ccc";
    searchContainer.style.borderRadius = "10px";
    searchContainer.style.padding = "5px";
    searchContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    searchContainer.style.zIndex = "1000";
    searchContainer.style.width = "200px";
    searchContainer.style.maxHeight = "150px";
    searchContainer.style.overflowY = "auto";
    searchContainer.style.display = "none"; 
    document.body.appendChild(searchContainer);


    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("focus", () => {
        const rect = searchBar.getBoundingClientRect();
        searchContainer.style.left = `${rect.left}px`;
        searchContainer.style.top = `${rect.bottom + window.scrollY}px`;
        searchContainer.style.display = "block"; 
    });

    searchBar.addEventListener("blur", () => {
        setTimeout(() => {
            searchContainer.style.display = "none"; 
        }, 200); 
    });


    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase().trim();
        const recommendations = data
            .filter(d => d.l_aadress.toLowerCase().includes(query))
            .slice(0, 5);


        searchContainer.innerHTML = "";

        recommendations.forEach(rec => {
            const recItem = document.createElement("div");
            recItem.textContent = rec.l_aadress;
            recItem.style.padding = "5px";
            recItem.style.cursor = "pointer";
            recItem.style.fontFamily = "'Poppins', sans-serif";
            recItem.style.fontSize = "14px";
            recItem.style.borderBottom = "1px solid #eee";

            recItem.addEventListener("click", () => {

                searchBar.value = rec.l_aadress;
            

                searchContainer.style.display = "none";
            
                const bubble = zoomLayer.selectAll("g").filter(d => d.l_aadress === rec.l_aadress);
            
                if (!bubble.empty()) {
                    zoomLayer.selectAll("circle")
                        .style("opacity", 0.45)
                        .style("stroke", "none");
            
                    zoomLayer.selectAll("text")
                        .style("opacity", 0.3);
            
                    bubble.select("circle")
                        .style("opacity", 1)
                        .style("stroke", "black")
                        .style("stroke-width", 0);
            
                    bubble.select("text")
                        .style("opacity", 1);

                    const matchedData = data.find(d => d.l_aadress === rec.l_aadress);
                    if (matchedData) {
                        const allCounts = data.map(d => d.count);
                        updateDynamicFacts(matchedData.l_aadress, matchedData.count, allCounts);
                    }

                    showMap(rec.l_aadress);
                } else {
                    console.error("Bubble not found for:", rec.l_aadress);
                }
            });
            
            

            searchContainer.appendChild(recItem);
        });

        searchContainer.style.display = recommendations.length ? "block" : "none";
    });

    searchBar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchBar.value.toLowerCase().trim();
            const match = data.find(d => d.l_aadress.toLowerCase() === query);
    
            if (match) {
                const bubble = zoomLayer.selectAll("g").filter(d => d.l_aadress === match.l_aadress);
    
                if (!bubble.empty()) {
                    zoomLayer.selectAll("circle")
                        .style("opacity", 0.45)
                        .style("stroke", "none");
    
                    zoomLayer.selectAll("text")
                        .style("opacity", 0.3);
    

                    bubble.select("circle")
                        .style("opacity", 1)
                        .style("stroke", "black")
                        .style("stroke-width", 2); 
    
                    bubble.select("text")
                        .style("opacity", 1);

                const allCounts = data.map(d => d.count);
                updateDynamicFacts(match.l_aadress, match.count, allCounts);
    
                    showMap(match.l_aadress);
                } else {
                    console.error("Bubble not found for:", match.l_aadress);
                }
            } else {
                console.error("No match found for:", query);
            }
        }
    });
    

    let isSimulationRunning = true;


const simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .force("collide", d3.forceCollide(d => d.r + 2)) 
    .alphaMin(0.00002) 
    .on("tick", ticked)
    .on("end", () => {
        isSimulationRunning = false; 
        

        data.forEach(d => {
            d.staticX = d.x;
            d.staticY = d.y;
        });
    
 
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
    
        data.forEach(d => {
            const r = d.r;
            const left = d.staticX - r;
            const right = d.staticX + r;
            const top = d.staticY - r;
            const bottom = d.staticY + r;
    
            if (left < minX) minX = left;
            if (right > maxX) maxX = right;
            if (top < minY) minY = top;
            if (bottom > maxY) maxY = bottom;
        });
    
        const packWidth = maxX - minX;
        const packHeight = maxY - minY;
    

        const chartRect = document
          .getElementById("chart-container")
          .getBoundingClientRect();
        const chartWidth = chartRect.width;
        const chartHeight = chartRect.height;
    
  
        const scaleX = chartWidth / packWidth;
        const scaleY = chartHeight / packHeight;
        const fitScale = Math.min(scaleX, scaleY) * 0.9; 
    

        const boxCenterX = minX + packWidth / 2;
        const boxCenterY = minY + packHeight / 2;
        const finalX = chartWidth / 2 - boxCenterX * fitScale;
        const finalY = chartHeight / 2 - boxCenterY * fitScale;
    

        const newTransform = d3.zoomIdentity
          .translate(finalX, finalY)
          .scale(fitScale);
    

        svg.transition()
            .duration(750)
            .call(zoom.transform, newTransform);

        setTimeout(() => {

          if (document.getElementById("legend-toggle").checked) {
            buildLegend();
            fadeInLegend();
          }

          if (!localStorage.getItem("tourSeen")) {
            startTour();  
          }
        }, 1000);
    });
    




function ticked() {
    const nodes = zoomLayer.selectAll("g")
        .data(data);

    const enterNodes = nodes.enter()
        .append("g")
        .on("mouseover", function (event, d) {
            if (isSimulationRunning) return;
            this.parentNode.appendChild(this); 


            const transitionDuration = Math.max(100, Math.min(300, d.r * 5));

            d3.select(this).select("circle")
                .interrupt() 
                .transition()
                .duration(transitionDuration) 
                .attr("r", d.r * 1.6);


            if (!d3.select(this).select(".count").node()) {
                d3.select(this).append("text")
                    .attr("class", "count")
                    .attr("x", 0)
                    .attr("y", d.r / 1.5) 
                    .style("font-size", `${Math.max(d.r / 6, 8)}px`) 
                    .style("fill", "white")
                    .style("text-anchor", "middle")
                    .text(d.count);

            if (selectedBubbleRef) {
                d3.select(this).select("circle")
                    .style("opacity", 1)
                    .style("stroke", "black"); 
                d3.select(this).select("text")
                    .style("opacity", 1);
            }
            }
        })
        .on("mouseout", function (event, d) {
            if (isSimulationRunning) return; 

            d3.select(this).select("circle")
                .interrupt()
                .transition()
                .duration(200) 
                .attr("r", d.r);


            if (selectedBubbleRef && selectedBubbleRef !== this.querySelector("circle")) {
                d3.select(this).select("circle")
                    .style("opacity", 0.4)
                    .style("stroke", "none");
                d3.select(this).select("text")
                    .style("opacity", 0.3);
            }

            d3.select(this).select(".count").remove();
        })
        .on("click", function (event, d) {
            if (isSimulationRunning) return; 
            handleBubbleClick(event, d); 
        });

    enterNodes.append("circle")
        .attr("r", d => d.r)
        .attr("stroke", "none")
        .attr("stroke-width", 0)
        .attr("fill", (d, i) => {

          if (d.category_2) {
            const gradId = `gradient-${i}`;
      
            const gradient = defs.append("linearGradient")
              .attr("id", gradId)
              .attr("x1", "0%")
              .attr("y1", "0%")
              .attr("x2", "100%") 
              .attr("y2", "0%");
      

            gradient.append("stop")
              .attr("offset", "0%")
              .attr("stop-color", categoryColors[d.category_1] || "#000");
      
            gradient.append("stop")
              .attr("offset", "100%")
              .attr("stop-color", categoryColors[d.category_2] || "#999");
      
            return `url(#${gradId})`;
          }
      
          return categoryColors[d.category_1] || "#000";
        });
      

    enterNodes.append("text")
        .text(d => d.l_aadress)
        .attr("class", "bubble")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", d => `${Math.max(d.r / 4, 10)}px`) 
        .style("fill", "white")
        .style("text-anchor", "middle");

    nodes.merge(enterNodes)
        .attr("transform", d => {
            return isSimulationRunning
                ? `translate(${d.x},${d.y})`
                : `translate(${d.staticX},${d.staticY})`;
        });


    updateTextVisibility(1); 
}


}).catch(error => {
    console.error("Error loading or processing data:", error);
});






let mkCountData = []; 


d3.csv("mk_count.csv").then((csvData) => {
    mkCountData = csvData.map(d => ({
        mk_nimi: d.mk_nimi,
        count: +d.count 
    }));
}).catch(error => console.error("Error loading mk_count.csv:", error));


let mkOvCountData = []; 


d3.csv("mk_ov_count2.csv").then(data => {
    mkOvCountData = data.map(d => ({
        l_aadress: d.l_aadress,
        mk_count: +d.mk_count,
        ov_count: +d.ov_count
    }));
}).catch(error => console.error("Error loading mk_ov_count2.csv:", error));


function clearCharts() {
    d3.select("#horizontal-bar-chart").selectAll("*").remove();
    d3.select("#vertical-bar-chart").selectAll("*").remove();
}






function updateAdditionalFacts(chosenName, filteredFeatures) {

    let bullet1 = "";
    const mkOvEntry = mkOvCountData.find(
        d => d.l_aadress.toLowerCase() === chosenName.toLowerCase()
    );
    if (mkOvEntry) {
        const { mk_count, ov_count } = mkOvEntry;

   
        if (mk_count === 15 && ov_count === 64) {
            bullet1 = `Kohanimi ${chosenName.toUpperCase()} on olemas igas Eesti maakonnas ja vallas.`;
        }

        else if (mk_count === 15) {
            bullet1 = `Kohanimi ${chosenName.toUpperCase()} on olemas igas Eesti maakonnas.`;
        }
    }


    let bullet2 = "";
    if (filteredFeatures.length > 0) {
        const groupedByCounty = d3.rollups(
            filteredFeatures,
            v => v.length,
            f => f.properties.mk_nimi
        );
        groupedByCounty.sort((a, b) => b[1] - a[1]);
        const total = d3.sum(groupedByCounty, d => d[1]);

        const topCounty = groupedByCounty[0]; 
        if (topCounty) {
            const [countyName, count] = topCounty;
            const percent = Math.round((count / total) * 100);


            const countyNameForDisplay = countyName.replace(" maakond", "") + " maakonnas";
            bullet2 = `<span style="font-weight:600;">Kõige populaarsem on nimi ${chosenName.toUpperCase()} ${countyNameForDisplay}</span> – ${percent}% kõigist selle nimega katastriüksustest asub seal.`;
        }
    }


    let bullet3 = "";
    if (filteredFeatures.length > 0) {

        const totalArea = d3.sum(filteredFeatures, f => +f.properties.pindala);
        const avgSqMeters = totalArea / filteredFeatures.length;
        const avgHectares = avgSqMeters / 10000; 
        bullet3 = `${chosenName.toUpperCase()} nimeliste katastriüksuste keskmine suurus on ${avgHectares.toFixed(1)} hektarit.`;
    }


    const container = document.getElementById("additional-facts");
    if (!container) return;

    container.innerHTML = ""; 
    const bulletItems = [bullet1, bullet2, bullet3].filter(b => b !== "");

    if (bulletItems.length > 0) {
        const ul = document.createElement("ul");
        ul.style.listStyleType = "disc";
        ul.style.marginLeft = "20px"; 

        bulletItems.forEach(text => {
            const li = document.createElement("li");
            li.style.fontWeight = 200;
            li.style.fontSize = "12pt";
            li.style.margin = "5px 0";

 
            li.innerHTML = text; 

            ul.appendChild(li);
        });

        container.appendChild(ul);
    }
}





function showMap(name) {
    console.log("Opening map for:", name);

    const titleElement = document.getElementById("dynamic-title");
    titleElement.textContent = `Kohanime ${name.toUpperCase()} statistika`;

    const chartContainer = document.getElementById("chart-container");
    const infoPanel = document.getElementById("info-panel");

    chartContainer.style.flex = "1"; 
    infoPanel.style.flex = "2"; 

    if (window.map) {
        window.map.off(); 
        window.map.remove(); 
        window.map = null; 
    }

    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = ""; 


    window.map = L.map("map-container").setView([58.5953, 25.0136], 7);


    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
            attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
            maxZoom: 16,
        }
    ).addTo(window.map);

  
    fetch(`maps/${name}.geojson`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`GeoJSON file for ${name} not found.`);
            }
            return response.json();
        })
        .then((geojson) => {
            L.geoJSON(geojson, {
                style: function (feature) {
                    const gridcode = feature.properties.gridcode;
                    const colorScale = {
                        0: "transparent",
                        1: "rgba(160, 120, 255, 0)",
                        2: "rgba(160, 120, 255, 0.25)",
                        3: "rgba(160, 120, 255, 0.5)",
                        4: "rgba(160, 120, 255, 0.7)",
                        5: "rgba(160, 120, 255, 0.9)"
                    };
                    return {
                        fillColor: colorScale[gridcode] || "transparent",
                        fillOpacity: 1,
                        weight: 0, 
                    };
                },
            }).addTo(window.map);
        })
        .catch((error) => {
            console.error(`Error loading KDE GeoJSON for ${name}:`, error);
            alert(`Density map for "${name}" is not available.`);
        });


        fetch("points.geojson")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load points GeoJSON.");
            }
            return response.json();
        })
        .then((data) => {
            if (!data.features || !Array.isArray(data.features)) {
                throw new Error("Invalid GeoJSON format: 'features' is missing or not an array.");
            }

            const filteredData = {
                ...data,
                features: data.features.filter(
                    (feature) => feature.properties.l_aadress === name
                ),
            };

            if (filteredData.features.length === 0) {
                console.warn(`No features found for name: ${name}`);
            }

            console.log("Filtered Data:", filteredData);
            
            L.geoJSON(filteredData, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 4, 
                        fillColor: "#003e71",
                        color: "#003e71",
                        weight: 0.4,
                        opacity: 1,
                        fillOpacity: 0.7,
                    });
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(`<strong>Name:</strong> ${feature.properties.l_aadress}`);
                },
            }).addTo(window.map);


            clearCharts();


            drawHorizontalBarChart(filteredData.features, mkCountData, name);
            drawVerticalBarChart(filteredData.features); 
            updateAdditionalFacts(name, filteredData.features);
        })
        .catch((error) => {
            console.error("Error loading points GeoJSON:", error);
            alert("An error occurred while loading the points data.");
        });

}





function drawHorizontalBarChart(features, mkCountData, name) {
    const container = document.getElementById('horizontal-bar-chart');
    const width = container.clientWidth; 
    const height = container.clientHeight; 
    const margin = { top: 20, right: 20, bottom: 50, left: 150 };


    const occurrenceMap = d3.group(features, d => d.properties.mk_nimi);

    const mergedData = mkCountData.map(d => {
        const mk_nimi = d.mk_nimi;
        const occurrences = (occurrenceMap.get(mk_nimi) || []).length;
        const totalCadasters = d.count || 0;
        return {
            mk_nimi,
            occurrences,
            per10k: (occurrences / totalCadasters) * 10000 || 0,
            totalCadasters,
        };
    });

    mergedData.sort((a, b) => b.per10k - a.per10k);

    const chartTitle = document.getElementById("horizontal-bar-chart-title");
    if (chartTitle) {
        chartTitle.textContent = `Nime ${name} esinemissagedus maakonna 10 000 katastriüksuse kohta`;
    }

    const svg = d3.select("#horizontal-bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(mergedData, d => d.per10k)])
        .range([0, width - margin.left - margin.right]);

    const y = d3.scaleBand()
        .domain(mergedData.map(d => d.mk_nimi))
        .range([0, height - margin.top - margin.bottom])
        .padding(0.2);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d => d)); 

    svg.selectAll(".bar")
        .data(mergedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.mk_nimi))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", 0) 
        .attr("fill", "#613c8c")
        .on("mouseover", (event, d) => {
            d3.select(event.currentTarget).attr("fill", "#72bfd6");

            d3.select("#tooltip")
                .style("opacity", 1)
                .html(`${d.mk_nimi}: ${d.per10k.toFixed(2)}<br>Katastriüksusi kokku: ${d.totalCadasters}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", (event) => {
            d3.select(event.currentTarget).attr("fill", "#613c8c");

            d3.select("#tooltip").style("opacity", 0);
        })
        .transition() 
        .duration(400) 
        .delay((d, i) => i * 50) 
        .attr("width", d => x(d.per10k)); 
}





function drawVerticalBarChart(filteredData) {
    const container = document.getElementById('vertical-bar-chart');
    const width = container.clientWidth; 
    const height = container.clientHeight; 
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };


    const yearlyData = d3.rollup(
        filteredData,
        v => v.length,
        d => d.properties.registr.substring(0, 4) 
    );

    const allYears = Array.from({ length: 2024 - 1993 + 1 }, (_, i) => (1993 + i).toString());

    const processedData = allYears.map(year => ({
        year,
        count: yearlyData.get(year) || 0
    }));

    processedData.sort((a, b) => a.year - b.year);

    const svg = d3.select("#vertical-bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(processedData.map(d => d.year))
        .range([0, width - margin.left - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.count)])
        .range([height - margin.top - margin.bottom, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d => d).tickSizeOuter(0))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("dy", "-0.5em")
        .attr("dx", "-0.8em")
        .style("font-size", "10px");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d));

        svg.selectAll(".bar")
            .data(processedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.year))
            .attr("y", height - margin.top - margin.bottom) 
            .attr("width", x.bandwidth())
            .attr("height", 0) 
            .attr("fill", "#613c8c")
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).attr("fill", "#72bfd6");
        
                d3.select("#tooltip")
                    .style("opacity", 1)
                    .html(
                        `${d.year}. aastal registreeritud katastriüksuste arv: ${d.count}`
                    )
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", (event) => {
                d3.select(event.currentTarget).attr("fill", "#613c8c");
        
                d3.select("#tooltip").style("opacity", 0);
            })
            .transition() 
            .duration(800)
            .delay((d, i) => i * 50)
            .attr("y", d => y(d.count))
            .attr("height", d => height - margin.top - margin.bottom - y(d.count)); 
    
    
}










function closeInfoPanel() {
    const chartContainer = document.getElementById("chart-container");
    const infoPanel = document.getElementById("info-panel");
  
    chartContainer.style.flex = "1";
    infoPanel.style.flex = "0";
  
    if (window.map) {
      window.map.off();
      window.map.remove();
      window.map = null;
    }
  

    if (wasLegendOpen) {
      document.getElementById("legend-toggle").checked = true;
      fadeInLegend();
    }

    resetBubbleStyles();

  }
  

document.getElementById("close-panel").addEventListener("click", closeInfoPanel);










const tourSteps = [
    {

      text: `Oled avastanud Kohanimekompassi. Siin saad tutvuda Eestis kõige laialdasemalt kasutatavate katastrinimede ja nende levikuga. Katastrinimed võivad esmapilgul tunduda ebaoluliste formaalsustena, ent tegelikult kannavad need endas jälgi nii kohalikust loodusest, kultuurist kui ka ajaloost. Kohanimekompassis on esindatud kõik nimed, mida kannab Eestis vähemalt 50 katastriüksust. 
Kompass on interaktiivne: suumi sisse, liigu ringi ning klikka huvipakkuvatele nimedele, et rohkem teada saada. Huvipakkuvate nimede leidmiseks võid kasutada ka otsingut.`,
      highlightSelector: "#chart-container"
    },
    {

      text: `Katastrinimed on kategooriatesse jaotatud selle põhjal, millele nende sisu viitab. Kui nimele vastab üks kategooria, on nimesümbol ühevärviline; kui aga kaks, on nimesümbolil kaks ühte sulanduvat värvi. Siit saad joonise värviskeemiga tutvuda ning nimekihte sisukategooria põhjal välja või sisse lülitada. Üks klikk lülitab kihi välja, teine tagasi sisse.`,
      highlightSelector: "#legend-container"
    },
    {

      text: `Kohanimekompass valmis aine ”Andmete visualiseerimine ja esitlus - LTAT.02.008” lõputööna. Andmestiku tutvustus, tööprotsess ja stiilinäited leiad Lisainfo alalehelt.`,
      highlightSelector: "#lisainfo-btn",
      finalButtonLabel: "Hakkan avastama"
    }
  ];
  

  let currentStepIndex = 0;

  function startTour() {
    currentStepIndex = 0;
    showStep(currentStepIndex);
  }
  

  function showStep(index) {
    const step = tourSteps[index];
    if (!step) {

      hideTourOverlay();
      return;
    }
  

    document.getElementById("tour-overlay").style.display = "block";
    document.getElementById("tour-popup").style.display = "block";
  
    document.getElementById("tour-text").textContent = step.text;

    const nextBtn = document.getElementById("tour-next-btn");
    nextBtn.textContent = step.finalButtonLabel || "Jätka";

    if (step.highlightSelector) {
      highlightElement(step.highlightSelector);
    } else {
      document.getElementById("tour-highlight").style.display = "none";
    }
  }
  
 
  function nextStep() {
    currentStepIndex++;
    if (currentStepIndex >= tourSteps.length) {

      hideTourOverlay();

      localStorage.setItem("tourSeen", "true");
      return;
    }
    showStep(currentStepIndex);
  }
  
  
  function hideTourOverlay() {
    document.getElementById("tour-overlay").style.display = "none";
    document.getElementById("tour-popup").style.display = "none";
    document.getElementById("tour-highlight").style.display = "none";
  }
  

  function highlightElement(selector) {
    const el = document.querySelector(selector);
    if (!el) {
      document.getElementById("tour-highlight").style.display = "none";
      return;
    }
    const rect = el.getBoundingClientRect();
    const highlight = document.getElementById("tour-highlight");
    highlight.style.display = "block";
    highlight.style.top = rect.top + "px";
    highlight.style.left = rect.left + "px";
    highlight.style.width = rect.width + "px";
    highlight.style.height = rect.height + "px";
  }
  
  document.getElementById("tour-next-btn").addEventListener("click", nextStep);
  