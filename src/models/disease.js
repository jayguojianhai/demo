export default {
  namespace: 'disease',

  state: {},

  effects: {
    * fetchList() {
      return {
        data: {
          rows: [{ id: 1, name: 'jay' }, { id: 2, name: 'jay2' }],
        },
      };
    },
  }
};
