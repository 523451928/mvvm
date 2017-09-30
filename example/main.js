import MVVM from 'mvvm'

const template = `
<h2>Welcome {{user.firstname}} <span>{{user.lastname}}</span></h2> 
<input type="text" v-model="word">
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
