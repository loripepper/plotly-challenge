function buildMetadata(sample) {
    //     // alert("Build Metadata");

    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      
      var resultsarray = metadata.filter(sampleobject => sampleobject.id == sample);

      var result= resultsarray[0]

      var panel = d3.select("#sample-metadata");

      panel.html("");

      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });

    //   Build Gauge Chart
    buildGauge(result.wfreq);
      
    });
  }

function buildCharts(sample) {
    // alert("Build Charts");
    // console.log(sample);
    d3.json("samples.json").then(function(data) {
        var samples = data.samples;
        // console.log(samples)
        var resultsArray = samples.filter(function(data) {
            return data.id === sample;
        })
        // console.log(resultsArray);
        var result = resultsArray[0];
        // console.log(result);

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Create Bubble Chart
        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID"},
            margin: {t:30}
        }

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        var yticks = otu_ids.slice(0,10).map(function(otuID) {
            return `OTU ${otuID}`
        }).reverse();
        // console.log(yticks);

        var barData = [
            {
                y:yticks,
                x:sample_values.slice(0,10).reverse,
                text:otu_labels.slice(0,10).reverse,
                type: "bar",
                orientation: "h"
            }
        ];

        var barLayout = {
            title: "Top Bacteria Cultures Found",
            margin: {t:30, l:150}
        };

        Plotly.newPlot("bar", barData, barLayout);
    });

}

// Fetch new data each time a new sample is selected
function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
    }

function init() {
    // console.log("Connection successful!");

    var selector = d3.select("#selDataset");
    console.log(selector);
    // Use the D3 library to read in samples.json.
    d3.json("samples.json").then(function(data) {
        console.log(data);
        var sampleNames = data.names;

        sampleNames.forEach(function(name) {
            selector
            .append("option")
            .text(name)
            .property("value", name)
        })

        var firstSample = sampleNames[0];
        // console.log(firstSample);
        buildCharts(firstSample);
        buildMetadata(firstSample);

    })
}

init();





