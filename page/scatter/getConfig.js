/**
 * Created by xiabingwu on 2016/11/21.
 */
import Chart from '../canvas/chart'
export default function (canvasConfig, labels, data) {
  var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)'
  };
  var randomScalingFactor = function () {
    return Math.round(Math.random() * 100);
  };
  var color = Chart.helpers.color;
  var scatterChartData = {
    datasets: [{
      label: "我的轨迹",
      xAxisID: "x-axis-1",
      yAxisID: "y-axis-1",
      borderColor: chartColors.blue,
      backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
      data: []
      // data: [{
      //     x: 2.3,
      //     y: 2,
      //     text: '冬天下雪'
      // }, {
      //     x: 6.741935483870968,
      //     y: 0,
      //     text: '春天花开'
      // }, {
      //     x: 9.2,
      //     y: -7,
      //     text: '秋有月'
      // }]
    }]
  };
  var chartConfig = {
    type: 'scatter',
    data: scatterChartData,
    options: {
      responsive: false,
      hoverMode: 'nearest',
      intersect: true,
      title: {
        display: true,
        text: '可以试试点一下每个事件哦'
      },
      tooltips: {
        displayColors: false,//不显示小方框
        mode: 'x',
        callbacks: {
          title: function (tooltipItem) {
            //return tooltipItem[0].xLabel+':'+tooltipItem[0].yLabel;
            console.log('title: ', tooltipItem)
            return scatterChartData.datasets[0].data[tooltipItem[0].index].text;
          },
          label: function (tooltipItem) {
            //return tooltipItem.yLabel+'';
            return '';
          }
        }
      },
      scales: {
        xAxes: [{
          position: "bottom",
          scaleLabel: {
            display: true,
            labelString: "2017"
          },
          gridLines: {
            zeroLineColor: "rgba(0,0,0,1)"
          },
          ticks: {
            max: 12,
            stepSize: 2
          }          
        }],
        yAxes: [{
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: "left",
          id: "y-axis-1",
          // grid line settings
          gridLines: {
            drawOnChartArea: true // only want the grid lines for one axis to show up
          }
        }],
      }
    }
  };
  return {
    chartConfig: chartConfig,
    canvasConfig: canvasConfig
  }
}