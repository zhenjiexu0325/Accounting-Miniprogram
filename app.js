App({
  // Global data; pages can access via getApp().globalData
  globalData: {
    records: [] // { id, type: 'expense'|'income', amount, category, note, date(YYYY-MM-DD), createTime }
  },

  onLaunch() {
    this.loadRecords();
  },

  // Load all records from local storage
  loadRecords() {
    try {
      const records = wx.getStorageSync('records') || [];
      this.globalData.records = records;
    } catch (e) {
      console.error('Failed to read local records', e);
      this.globalData.records = [];
    }
  },

  // Save records to local storage and update global data
  saveRecords(records) {
    this.globalData.records = records;
    try {
      wx.setStorageSync('records', records);
    } catch (e) {
      console.error('Failed to write local records', e);
      wx.showToast({ title: 'Save failed', icon: 'none' });
    }
  }
});
