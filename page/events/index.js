Page({
  data: {
    monthYearType: 'month', // whether the current chart is for month or for year
    pickerStartDate: '2017-01-01', // picker start date according to the picker selected and the monthYearType
    pickerEndDate: '2017-12-31', // picker end date according to the picker selected and the monthYearType
    pickerChosenValue: '2017-01',
    lifeChartName: '点我起名,比如-多少人来看明月^_-', // name for the current life chart, with no "@2017-01" etc
    lifeChartNames: [], // all the existing life chart names， which contains "@2017-01" etc
    changeIsDisabled: false, // whether we allow any further change on the page
    step1: [
      {
        current: true,
        done: true,
        text: '1.确认年月'
      },
      {
        done: false,
        current: false,
        text: '2.添加事件'
      },
      {
        done: false,
        current: false,
        text: '3.生成轨迹图'
      }
    ]
  },  

  pickerChange: function (e) {
    //console.log('picker change:', e.detail.value)
    this.evaluatePicker(e.detail.value.toString());
  },

  radioChange: function (e) {
    if (e.detail.value == "month") {
      if (this.data.pickerChosenValue.length == 4) {
        this.setData({
          pickerChosenValue: this.data.pickerChosenValue + "-01"
        });
      }
    } else {
      if (this.data.pickerChosenValue.length > 4) {
        this.setData({
          pickerChosenValue: this.data.pickerChosenValue.substring(0, 4)
        });
      }
    }
    this.evaluatePicker(this.data.pickerChosenValue)
    console.log("pickerChosenValue:", this.data.pickerChosenValue);

    this.setData({
      monthYearType: e.detail.value,
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      lifeChartName: e.detail.value
    })
  },

  // life chart is clicked
  clickEvent: function (e) {
    var chartNameWithDate = e.currentTarget.id;
    var lastIndex = chartNameWithDate.lastIndexOf('@');
    var chartName = chartNameWithDate.substring(0, lastIndex);
    var pickerValue = chartNameWithDate.substring(lastIndex + 1, chartNameWithDate.length);
    var monthYearType = "month";
    if (pickerValue.length == 4) {
      monthYearType = "year";
    }
    this.setData({
      monthYearType: monthYearType,
      lifeChartName: chartName,
      pickerChosenValue: pickerValue,
      changeIsDisabled: true
    })
  },

  clickContinue: function (e) {
    var lifeChartNames = this.data.lifeChartNames;
    // If name does not exist, create new one. We do not allow change once created.
    if (!this.doesLifeChartNameAlreadyExist(lifeChartNames, this.data.lifeChartName)) {
      lifeChartNames.push(this.data.lifeChartName + "@" + this.data.pickerChosenValue);
      this.setData({
        lifeEventNames: lifeChartNames
      });

      var app = getApp();
      try {
        wx.setStorage({
          key: app.GlobalStorageKeyValue,
          data: lifeChartNames,
        });
      } catch (e) {
        console.log("Error when wx.setStorage for all chart names:",
          "key=" + app.GlobalStorageKeyValu + ",data=" + this.data.lifeChartName + ",error=" + e);
        return;
      }
    }

    // no change allowed for this life chart
    this.setData({
      changeIsDisabled: true
    });

    wx.navigateTo({
      url: '/page/events/events?pickerStartDate=' + this.data.pickerStartDate + '&pickerEndDate=' + this.data.pickerEndDate + '&pickerChosenValue=' + this.data.pickerChosenValue + '&monthYearType=' + this.data.monthYearType + '&lifeChartName=' + this.data.lifeChartName
    }) 
  },  

  getLastDate: function(y, m) {
    var lastDay = new Date(y, m + 1, 0);
    return lastDay.getDate();
  },

  doesLifeChartNameAlreadyExist: function(existingLifeChartNames, lifeChartName) {
    // existing name is like "MyChart@2017-01"
    if (existingLifeChartNames) {
      for (var i = 0; i < existingLifeChartNames.length; i++) {
        var lastIndex = existingLifeChartNames[i].lastIndexOf('@');
        var name = existingLifeChartNames[i].substring(0, lastIndex);
        if (name.toUpperCase() == lifeChartName.toUpperCase()) {
          return true;
        }
      }
    }

    return false;
  },

  evaluatePicker: function(pickerDate) {
    var startDate = pickerDate + "-01-01";
    var endDate = pickerDate + "-12-31";
    if (pickerDate.length > 4) {
      startDate = pickerDate + "-01";
      var year = pickerDate.substring(0, 3);
      var month = pickerDate.substring(5, 7);
      // month starts from 0
      endDate = pickerDate + "-" + this.getLastDate(year, month - 1);
    }
    console.log("startDate=" + startDate + ",endDate=" + endDate);

    this.setData({
      pickerStartDate: startDate,
      pickerEndDate: endDate,
      pickerChosenValue: pickerDate
    })
  },

  onShow: function () {
    var app = getApp();
    // get all the life chart names
    try {
      var lifeChartNames = wx.getStorageSync(app.GlobalStorageKeyValue);
    } catch (e) {
      console.log("Error when wx.getStorage for all chart names, error=", e);
      return;
    }
      
    if (lifeChartNames) {
      this.setData({
        lifeChartNames: lifeChartNames
      });
    }
    console.log("lifeChartNames:", this.data.lifeChartNames);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      changeIsDisabled: false
    });
  }
})