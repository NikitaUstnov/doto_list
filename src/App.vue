<template>
  <router-view />
</template>
<script setup lang="ts"></script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  color: #2c3e50;
  background: rgb(34, 195, 182);
  background: linear-gradient(0deg, #22c3b6 0%, rgba(253, 212, 45, 1) 100%);

  height: 100vh;
}

h3 {
  font-size: 14px;
}
h4 {
  font-size: 12px;
}
label {
  font-size: 11px;
}
p {
  font-size: 10px;
}
span {
  font-size: 10px;
}

@media screen and (min-width: 768px) {
  h3 {
    font-size: 16px;
  }
  h4 {
    font-size: 14px;
  }
  label {
    font-size: 13px;
  }
  p {
    font-size: 12px;
  }
  span {
    font-size: 12px;
  }
}
@media screen and (min-width: 1024px) {
  h3 {
    font-size: 18px;
  }
  h4 {
    font-size: 16px;
  }
  label {
    font-size: 15px;
  }
  p {
    font-size: 14px;
  }
  span {
    font-size: 14px;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar:horizontal {
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}

::-webkit-scrollbar-thumb {
  background-color: #d4aa70;
  border-radius: 100px;
}

.active {
  color: #ffbd60;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
