const Utils = ChartUtils.init();
const DATA_COUNT = 12;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };
var ctx = document.getElementById('myChart');
var gradient = ctx.getContext('2d').createLinearGradient(0, 10, 0, 400);
var orange = '#da7227';
var blue = '#2595cd';
var white = '#ddd6d7';
gradient.addColorStop(0, orange);
gradient.addColorStop(0.5, white);
gradient.addColorStop(1, blue);
const labels = Utils.months({ count: DATA_COUNT });
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Empower',
      fill: false,
      borderColor: "#5e5959",
      borderDash: [3, 3],
      data: Utils.numbers(NUMBER_CFG),
    },
    {
      label: 'Reward',
      fill: false,
      borderColor: "#5c5c5c",
      borderWidth: 1,
      borderDash: [5, 5],
      data: Utils.numbers(NUMBER_CFG),
    },
    {
      label: 'Setup',
      borderColor: "#2b2929",
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
const chartAreaBorder = {
  id: 'chartAreaBorder',
  beforeDraw(chart, args, options) {
    const {ctx, chartArea: {left, top, width, height}} = chart;
    ctx.save();
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.setLineDash(options.borderDash || []);
    ctx.lineDashOffset = options.borderDashOffset;
    //Draw the background
    ctx.fillStyle = "white";
    ctx.fillRect(left-options.borderWidth,top,width+(options.borderWidth*2),height+200);
    
    
    //Draw the left and right
    ctx.strokeStyle = gradient;
    ctx.strokeRect(left-(options.borderWidth/2),top,0,height);
    ctx.strokeRect(left+width+(options.borderWidth/2),top,0,height);
    
    ctx.restore();
  }
};
const config = {
  type: 'line',
  data: data,
  plugins: [chartAreaBorder,ChartDataLabels],
  options: {
    elements: {
      point:{
          radius: 0
      }
  },
    plugins: {
      chartAreaBorder: {
        borderWidth: 10,
        borderDash: [, 5],
        borderDashOffset: 2,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      datalabels: {
        color: function(ctx){
          return ctx.dataset.borderColor;
        },
        align: "right",
        anchor: 'center',
        offset:function(ctx){
          var rise = (ctx.chart.height/100)*(ctx.dataset.data[ctx.dataIndex]) - (ctx.chart.height/100)*(ctx.dataset.data[ctx.dataIndex+1]);
            return rise/100;
        },
        clamp:true,
        font: {
          size: 10,
        },
        rotation: function(ctx) {
            var rise = (ctx.chart.height/100)*(ctx.dataset.data[ctx.dataIndex]) - (ctx.chart.height/100)*(ctx.dataset.data[ctx.dataIndex+1]);
            var run = (ctx.chart.width/ctx.dataset.data.length)
            var rotate = 180/Math.PI * Math.atan(rise/run);
            return rotate;
        },
        formatter: function (value, context) {

          if (context.dataIndex == context.datasetIndex) {
            return context.dataset.label;
          }
          return '';
        },
      },
    },
    scales: {
      
      x: {
        display: true,
        grid:{display:false},
        title: {
          display: false,
        },
      },
      y: {
        grid:{display:false},
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
        left: 10,
        right:10
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  },
};

var myChart = new Chart(document.getElementById('myChart'), config, data);
