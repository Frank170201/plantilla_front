import authServices from "@/services/auth.services";
import {defineStore} from "pinia";

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    menu: [],
    rutas_publicas:['Login', 'Forbidden'],
    menuHeight: 0,
  }),
  actions: {
    async getMenu() {
      const response = await authServices.getMenu()
      this.menu = response.data
      return response
    },
    setMenuHeight(height) {
      this.menuHeight = height;
    },
  }
})

