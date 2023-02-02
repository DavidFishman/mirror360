const Utils = ChartUtils.init();
const DATA_COUNT = 12;
const yMax = 1000;
const targetChartId = 'linechart';
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: yMax};
const ctx = document.getElementById(targetChartId);

//Chart Specific Styles
const pointRadius = 0;
const sideGradientWidth = 10;
const displayLegend = false;
const displayTitle = false;
const backgroundColor = "white";
const labelFontSize = 8;

//Declare Style Guidelines
const orange = '#da7227';
const blue = '#2595cd';
const fade = '#ddd6d7';
const gradient = ctx.getContext('2d').createLinearGradient(0, 10, 0, 400);
gradient.addColorStop(0, orange);
gradient.addColorStop(0.5, fade);
gradient.addColorStop(1, blue);

//Helper Functions
const calculateRise = function (ctx) {
    return (ctx.chart.height / yMax) * (ctx.dataset.data[ctx.dataIndex]) - (ctx.chart.height / yMax) * (ctx.dataset.data[ctx.dataIndex + 1]);
}
const calculateRun = function (ctx) {
    return (ctx.chart.width / ctx.dataset.data.length)
}
const calculateDegrees = function (rise, run) {
    return 180 / Math.PI * Math.atan(rise / run);
}

//Draw the curstom baground and borders
const customChartDrawings = {
    id: 'customChartDrawings',
    beforeDraw(chart, args, options) {
        const {ctx, chartArea: {left, top, width, height}} = chart;
        ctx.save();
        ctx.lineWidth = options.borderWidth;

        //Draw the background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(left - options.borderWidth, top, width + (options.borderWidth * 2), height + 200);


        //Draw the left and right
        ctx.strokeStyle = gradient;
        ctx.strokeRect(left - (options.borderWidth / 2), top, 0, height);
        ctx.strokeRect(left + width + (options.borderWidth / 2), top, 0, height);

        ctx.restore();
    }
};
// Define the DataSet
const line_colors = ["#5e5959", "#5c5c5c", "#2b2929"];
const labels = Utils.months({count: DATA_COUNT});
const data = {
    labels: labels,
    datasets: [
        {
            label: 'Empower',
            fill: false,
            borderColor: line_colors[0],
            borderDash: [3, 3],
            data: Utils.numbers(NUMBER_CFG),
        },
        {
            label: 'Reward',
            fill: false,
            borderColor: line_colors[1],
            borderWidth: 1,
            borderDash: [5, 5],
            data: Utils.numbers(NUMBER_CFG),
        },
        {
            label: 'Setup',
            borderColor: line_colors[2],
            borderWidth: 1,
            data: Utils.numbers(NUMBER_CFG),
            fill: false,
        },
        {
            label: '',
            backgroundColor: gradient,
            borderWidth: 1,
            data: Utils.numbers(NUMBER_CFG),
            fill: true,
        },
    ],
};

//Configure the Chart
const config = {
    type: 'line',
    data: data,
    plugins: [customChartDrawings, ChartDataLabels],
    options: {
        elements: {
            point: {
                radius: pointRadius
            }
        },
        plugins: {
            customChartDrawings: {
                borderWidth: sideGradientWidth
            },
            legend: {
                display: displayLegend,
            },
            title: {
                display: displayTitle,
            },
            datalabels: {

                align: "right",
                anchor: 'center',

                clamp: true,
                font: {
                    size: labelFontSize,
                }, offset: function (ctx) {
                    var rise = calculateRise(ctx);
                    return rise / yMax;
                }, color: function (ctx) {
                    return ctx.dataset.borderColor;
                },
                rotation: function (ctx) {
                    var rise = calculateRise(ctx);
                    var run = calculateRun(ctx);
                    var rotate = calculateDegrees(rise, run);
                    return rotate;
                },
                formatter: function (value, context) {
                    if (context.dataIndex == context.datasetIndex) {
                        // if (context.dataIndex == 0){
                        return context.dataset.label;
                    }
                    return '';
                },
            },
        },
        scales: {
            x: {
                display: true,
                grid: {display: false},
                title: {
                    display: false,
                },
            },
            y: {
                grid: {display: false},
                ticks: {
                    callback: function (value, index, ticks) {
                        return '';
                    },
                },
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        layout: {
            padding: {
                left: sideGradientWidth,
                right: sideGradientWidth
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    },
};

var lineChart = new Chart(ctx, config, data);
