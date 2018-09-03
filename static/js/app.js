function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    d3.json(`/metadata/${sample}`).then((metaSampledata) => {
      //console.log(metaSampledata);
      // metaPanel

      var metaPanel = d3.select("#sample-metadata");
      // Clear existing metadata
      metaPanel.html("");
      // Get keys; loop through and 
      // console.log(Object.entries(metaSampledata))
      Object.entries(metaSampledata).forEach(([key,value]) => {
        metaPanel.append("h6").text(`${key}: ${value}`);
      });   
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // console.log("test1");
    d3.json(`/samples/${sample}`).then((pieSampledata) => {
      //console.log(pieSampledata);

      const otu_ids = pieSampledata.otu_ids;
      const otu_labels = pieSampledata.otu_labels;
      const sample_values = pieSampledata.sample_values;

      // Bubble chart _________________________
      var bblData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Viridis"
        }
      }];

      // Layout
      var bblLayout = {
        margin: { t: 0},
        hovermode: "closest",
        xaxis: {title: "OTU ID"}
      };
      // html id = 'bubble'
      Plotly.plot("bubble", bblData, bblLayout);

      // Pie Chart_______________________________
      var pieData = [{
        values: sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hovertext: otu_labels.slice(0,10),
        hoverinfo: "hovertext",
        type: 'pie'
      }];
      
      // Layout
      var pieLayout = {
        margin: {t: 150, l: 150},
        height: 600,
        width: 600
      };
      
      Plotly.plot('pie', pieData, pieLayout);
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
