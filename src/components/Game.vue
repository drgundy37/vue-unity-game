<template>
  <div>
    <Unity
      :unity="unityContext"
      :width="`${window.width}px`"
      :height="`${window.height}px`"
    />
    <button @click="sendGameMessage">Send1</button>
  </div>
</template>

<script>
import UnityWebgl from 'unity-webgl';

const Unity = new UnityWebgl({
  loaderUrl: 'build/game.loader.js',
  dataUrl: 'build/game.data',
  frameworkUrl: 'build/game.framework.js',
  codeUrl: 'build/game.wasm',
});

export default {
  name: 'Game',

  components: {
    Unity: UnityWebgl.vueComponent,
  },

  data() {
    return {
      input: '',
      isLoading: true,
      unityContext: Unity,
      window: {
        height: 1000,
        width: 1400,
      },

    };
  },

  methods: {
    addEventListeners() {
      window.addEventListener('resize', this.setGameSize);
    },

    setGameSize() {
      // Resize game to full window
      this.window.height = window.innerHeight;
      this.window.width = window.innerWidth;
    },

    //send walletID to GET request in Unity (ServerTalkerTest.Login())
    sendLoginToUnity(myAddress) {  
      var walletId = myAddress
      Unity.send("EventSystem", "Login", walletId)
      console.log(walletId)
    },     


  },

  mounted() {
    //gets walletID and GET and sends to server
    //returns "user" in json format and calls function
    //to send user data to sendGameMessage
    //wait 1s before sending message to unity
    //so it can initialize
    var myAddress = localStorage.getItem('userAddress')
    setTimeout(() => {
      this.sendLoginToUnity(myAddress)
    }, 1000)
  },
  
    // redundant GET for logging in, but will be good
    // for getting full json response from server/db

    // fetch('http://localhost:8000/user/'+ myAddress)
    //   .then(async res => {
    //     const user = await res.json()
    //     console.log(user)
    //     setTimeout(() => {
    //     this.sendGameMessage(user)}, 1000)
    //    })
    //   .catch(err => console.log(err.message))  


  created() {
    this.setGameSize();
    this.addEventListeners();
    Unity.on('progress', (percent) => console.log('Unity Loaded: ', percent))
      .on('created', () => (this.isLoading = false))
      .on('destroyed', () => console.log('Unity Instance: Destroyed.'));
  },

  destroyed() {
    window.removeEventListener('resize', this.setGameSize);
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  .input {
    padding-right: 10px;
  }
}
</style>
