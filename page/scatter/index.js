//index.js
//获取应用实例
import chartWrap from '../canvas/chartWrap'
import getConfig from './getConfig'
var app = getApp()
Page({
    data: {
      step3: [
        {
          current: false,
          done: true,
          text: '1.确认年月'
        },
        {
          done: true,
          current: false,
          text: '2.添加事件'
        },
        {
          done: true,
          current: true,
          text: '3.生成轨迹图'
        }
      ]
    },
    onLoad: function (options) {
        let pageThis=this
        app.deviceInfo.then(function(deviceInfo){
            console.log('设备信息',deviceInfo)
            let width=Math.floor(deviceInfo.windowWidth-(deviceInfo.windowWidth/750)*10*2)//canvas宽度
            let height=Math.floor(width/1.6)//这个项目canvas的width/height为1.6
            let canvasId='myCanvas'
            let canvasConfig={
                width:width,
                height:height,
                id:canvasId
            }
            let config=getConfig(canvasConfig)
            console.log('options-', options)

            config.chartConfig.options.scales.xAxes[0].scaleLabel.labelString = options.label;
            var monthYearType = "month";
            config.chartConfig.options.scales.xAxes[0].ticks.max = 31;
            config.chartConfig.options.scales.xAxes[0].ticks.stepSize = 2;
            if (options.label.length == 4) {
              monthYearType = "year";
              config.chartConfig.options.scales.xAxes[0].ticks.max = 12;
              config.chartConfig.options.scales.xAxes[0].ticks.stepSize = 2;
            }
            var eventData = pageThis.getEventData(options.lifeChartName, monthYearType);
            eventData.sort(pageThis.compare);
            console.log("eventData:", eventData);
            for (var i = 0; i < eventData.length; i++) {
              config.chartConfig.data.datasets[0].data.push(eventData[i]);
            }

            chartWrap.bind(pageThis)(config);
        })
    },

    onShow: function () {
    },

    // Read the event data points from storage.
    getEventData: function (chartName, monthYearType) {
      try {
        var eventNames = wx.getStorageSync(chartName);
        var dataList = [];
        if (eventNames) {
          for (var i = 0; i < eventNames.length; i++) {
            var event = wx.getStorageSync(chartName + '_' + eventNames[i]);
            var rate = this.getRate(new Date(event.eventDate), monthYearType);
            var data = {};
            data.x = rate;
            data.y = event.happiness;
            data.text = event.eventText;
            dataList.push(data);
            console.log("event:", event);
          }
        }
        return dataList;
      } catch (e) {
        console.log("Error when wx.setStorage for getting all events for chartName ",
          chartName + ",error=" + e);
      }
    },

    // Determine the ratio for the date in terms of month or year, range is 0-12.
    // For example, 3/15 in terms of year (range 0-12) is about 2.5, 3/15 in terms of month (
    // range 0-31) is about 15.
    // 
    getRate: function (inputDate, monthYearType) {
      var date = inputDate.getDate();
      if (monthYearType == "year") {
        var year = inputDate.getYear();
        var month = inputDate.getMonth();
        // special case for 01-01
        if (month == 11 && date == 31) {
          return 0;
        }
        var totalDays = this.daysInMonth(month, year);
        return month + date/totalDays;
      } else {
        return date;
      }
    },

    // get the count of all the days in the month
    daysInMonth: function(month, year) {
      return new Date(year, month + 1, 0).getDate();
    },

    compare: function (event1, event2) {
      if(event1.x < event2.x) {
        return -1;
      }
      if (event1.x > event2.x) {
        return 1;
      }
      return 0;
    }
})
