const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    groupedRecords: [],
    summary: { income: 0, expense: 0, balance: 0 }
  },

  onShow() {
    // Reload on every show so data is fresh after returning from Add
    app.loadRecords();
    this.refreshView();
  },

  refreshView() {
    const records = app.globalData.records || [];
    const currentMonth = util.formatDate(new Date()).slice(0, 7); // YYYY-MM

    this.setData({
      groupedRecords: this.groupByDate(records),
      summary: util.calcMonthSummary(records, currentMonth)
    });
  },

  // Group by date; newest dates first, newest createTime within each group
  groupByDate(records) {
    const map = {};
    records.forEach(r => {
      const info = util.getCategoryInfo(r.type, r.category);
      const enriched = { ...r, categoryLabel: info.label, icon: info.icon };
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(enriched);
    });

    return Object.keys(map)
      .sort((a, b) => (a < b ? 1 : -1))
      .map(date => ({
        date,
        records: map[date].sort((a, b) => b.createTime - a.createTime)
      }));
  },

  onAddTap() {
    wx.navigateTo({ url: '/pages/add/add' });
  },

  // Long-press a record to confirm delete
  onDeleteRecord(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: 'Delete Record',
      content: 'Delete this accounting record?',
      confirmColor: '#E85C5C',
      success: (res) => {
        if (res.confirm) {
          const records = app.globalData.records.filter(r => r.id !== id);
          app.saveRecords(records);
          this.refreshView();
          wx.showToast({ title: 'Deleted', icon: 'none' });
        }
      }
    });
  }
});
