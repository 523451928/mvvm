import MVVM from 'mvvm'

const template = `<input type="text" v-model="word">
<p>{{word}}</p>
<button v-on:click="sayHi">change model</button>
`;

const vm = new MVVM({
  el: '#app',
  template,
  data: {
    word: 'Hello World!',
    user: {
      firstname: '李', 
      lastname: '彦龙'
    }
  },
  methods: {
    sayHi: function() {
      this.word = 'Hi, everybody!';
    }
  }
});
console.log(vm._data);