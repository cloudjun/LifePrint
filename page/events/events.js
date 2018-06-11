const Zan = require('../../dist/index');

// page/events/events.js
Page(Object.assign({}, Zan.Field, {

  /**
   * 页面的初始数据
   */
  data: {
    lifeChartName: '', // name for the current life chart
    pickerChosenValue: '', // the overall value like 2017 or 2017-07
    pickerStartDate: '', // range start date for the picker
    pickerEndDate: '', // range end date for the picker
    monthYearType: '', // year or month
    lifeEvent: {
      eventDate: '', // the current event date
      eventText: '', // the current event text
      happiness: 0, // the happiness value, from -10 to 10
    },
    lifeEventNames: [], // the value of the kvp for lifeChartName
    lifeEvents: [], // the list life events
    textAreaDescription: { // the textarea text description
      title: '事件说明',
      type: 'textarea',
      placeholder: '请在此简要输入你想记录的人生轨迹事件',
      value: ''
    },
    step2: [
      {
        current: false,
        done: true,
        text: '1.确认年月'
      },
      {
        done: true,
        current: true,
        text: '2.添加事件'
      },
      {
        done: false,
        current: false,
        text: '3.生成轨迹图'
      }
    ]
  },

  pickerDateChange: function (e) {
    var event = this.data.lifeEvent;
    event.eventDate = e.detail.value;
    this.setData({
      lifeEvent: event
    });
    console.log('eventdate: ', this.data.lifeEvent.eventDate);
  },

  slider4change(e) {
    var event = this.data.lifeEvent;
    event.happiness = e.detail.value;
    this.setData({
      lifeEvent: event
    });
    console.log('happiness: ', this.data.lifeEvent.happiness);
  },

  handleZanFieldChange(e) {
    // 如果页面有多个Stepper组件，则通过唯一componentId进行索引
    //var compoenntId = e.componentId;
    var event = this.data.lifeEvent;
    event.eventText = e.detail.value;
    this.setData({
      lifeEvent: event,
    });
    console.log("eventText: ", this.data.lifeEvent.eventText);
  },

  // life event is clicked
  clickEvent: function(e) {
    var eventDate = e.currentTarget.id;
    var event = wx.getStorageSync(this.data.lifeChartName + '_' + eventDate);
    if (event) {
      this.setData({
        'lifeEvent.eventDate': eventDate,
        'lifeEvent.happiness': event.happiness,
        'lifeEvent.eventText': event.eventText,
        'textAreaDescription.value': event.eventText
      });
    }
  },

  saveLifeEvent: function (e) {
    var eventNames = this.data.lifeEventNames;
    // Add the current life event to the life event list. If eventDate already exists in the 
    // list, it means this is an update.
    if (eventNames.indexOf(this.data.lifeEvent.eventDate) == -1) {
      eventNames.push(this.data.lifeEvent.eventDate);
      this.setData({
        lifeEventNames: eventNames
      });
      console.log("eventNames is:", eventNames);
    }

    try {
      wx.setStorage({
        key: this.data.lifeChartName,
        data: eventNames
      });
    } catch (e) {
      console.log("Error when wx.setStorage for chart->events:",
                  "key=" + this.data.lifeChartName + ",data=" + this.data.lifeEvent.eventDate +
                  ",error=" + e);
      return;
    }

    var key = this.data.lifeChartName + '_' + this.data.lifeEvent.eventDate;
    try {
      wx.setStorage({
        key: key,
        data: this.data.lifeEvent,
      });
    } catch (e) {
      console.log("Error when wx.setStorage for event->eventDetails:",
        "key=" + key + ",data=" + this.data.lifeEvent + ",error=" + e);
      return;      
    }
  },  

  clickContinue: function (e) {
    wx.navigateTo({
      url: '/page/scatter/index?label=' + this.data.pickerChosenValue + '&lifeChartName=' + this.data.lifeChartName
    });
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("options:", options);
      var event = this.data.lifeEvent;
      if (options.pickerChosenValue.length == 4) {
        event.eventDate = options.pickerChosenValue + "-01-01";
      } else {
        event.eventDate = options.pickerChosenValue + "-01";
      }
      this.setData({
        pickerChosenValue: options.pickerChosenValue,
        lifeEvent: event,
        pickerStartDate: options.pickerStartDate,
        pickerEndDate: options.pickerEndDate,
        monthYearType: options.monthYearType,
        lifeChartName: options.lifeChartName
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // event name is actually the event date
    var eventNames = wx.getStorageSync(this.data.lifeChartName);
    if (eventNames) {
      this.setData({
        lifeEventNames: eventNames
      });
    }   
    console.log("eventNames:", this.data.lifeEventNames);

    // for (var i = 0; i < eventNames.length; i++) {
    //   var event = wx.getStorageSync(this.data.lifeChartName + '_' + eventNames[i]);
    //   console.log("event:", event);
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
}));