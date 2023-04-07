// Set Url 
const BaseUrl = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Fetch url data & log it
d3.json(BaseUrl).then(function(data){
    console.log(data);
});

// Create function to build charts based on sample data
function BuildCharts(sample) {

    // Grab sample data from  BaseUrl
    d3.json(BaseUrl).then((data) => {
        var Samples = data.samples;
        var Results = Samples.filter(sampleobject =>
            sampleobject.id == sample);
        var Result = Results[0]

        var ids = Result.otu_ids;
        var labels = Result.otu_labels;
        var values = Result.sample_values;

        // Build bar chart
        var BarData = [
            {
                y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: values.slice(0, 10).reverse(),
                text: labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];

        var BarLayout = {
            title: "Top 10 Bacteria Cultures Identified",
            margin: {t: 50, l:200}
        };

        // Plot bar chart
        Plotly.newPlot("bar", BarData, BarLayout);

        // Build the bubble chart
        var LayoutBubble = {
            margin: {t: 50},
            xaxis: {title: "OTU ID"},
            hovermode: "closest",
        };

        var DataBubble = [
            {
                x: ids, 
                y: values, 
                text: labels, 
                mode: "markers", 
                marker: {
                    color: ids, 
                    size: values, 
                }
            }
        ];
        
        // Plot bubble chart
        Plotly.newPlot("bubble", DataBubble, LayoutBubble);
    });
}

// Build out MetaData
function BuildMetaData(sample) {
    d3.json(url).then((data) => {
        var MetaData = data.MetaData;
        var Results = MetaData.filter(sampleobject => 
            sampleobject.id == sample);
        var Result = Results[0]
        var Panel = d3.select("#sample-MetaData");
        Panel.html("");
        Object.entries(Result).forEach(([key, value]) => {
            Panel.append("h6").text(`${key}: ${value}`);
        });
    });
}

// Create a function to change charts based on selected dropdown element
function InitCharts() {

    // Grab reference to dropdown select element
    var selector = d3.select("#selDataset");

    // Populate select options with list of samples
    d3.json(BaseUrl).then((data) => {
        var SampleNames = data.names;
        SampleNames.forEach((Sample) => {
            selector
            .append("option")
            .text(Sample)
            .property("value", Sample);
        });

        // Use first sample from the list to build the initial plots
        const FirstSample = SampleNames[0];
        BuildCharts(FirstSample);
        BuildMetaData(FirstSample);
    });
}

// Grab new data, build charts & pull metadata for new selection
function UpdatedCharts(NewSample) {
    BuildCharts(NewSample);
    BuildMetaData(NewSample);
}

// Initialize dashboard
InitCharts();