const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    categoryList: util.CATEGORIES.expense,
    form: {
      type: 'expense',
      amount: '',
      category: util.CATEGORIES.expense[0].key,
      date: util.formatDate(new Date()),
      note: ''
    }
  },

  // Switch expense/income; refresh categories and reset selection
  onTypeChange(e) {
    const type = e.currentTarget.dataset.type;
    const categoryList = util.CATEGORIES[type];
    this.setData({
      'form.type': type,
      categoryList,
      'form.category': categoryList[0].key
    });
  },

  onAmountInput(e) {
    this.setData({ 'form.amount': e.detail.value });
  },

  onCategoryTap(e) {
    this.setData({ 'form.category': e.currentTarget.dataset.key });
  },

  onDateChange(e) {
    this.setData({ 'form.date': e.detail.value });
  },

  onNoteInput(e) {
    this.setData({ 'form.note': e.detail.value });
  },

  onSave() {
    const { type, amount, category, date, note } = this.data.form;
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      wx.showToast({ title: 'Enter a valid amount', icon: 'none' });
      return;
    }

    const record = {
      id: util.genId(),
      type,
      amount: Math.round(numAmount * 100) / 100,
      category,
      date,
      note: note.trim(),
      createTime: Date.now()
    };

    const records = [...app.globalData.records, record];
    app.saveRecords(records);

    wx.showToast({ title: 'Saved', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 400);
  }
});
