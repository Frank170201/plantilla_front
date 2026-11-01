module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  rules: {
    'vue/valid-v-slot': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/multi-word-component-names': 'off',
  }
}
