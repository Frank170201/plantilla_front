import { computed } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

export const usePageMargin = () => {
    const display = useDisplay();

    const margen = computed(() => {
        if (display.mdAndDown.value) {
            return 'padding: 16px;';
        }

        if (display.lgAndDown.value) {
            return 'padding: 25px 68px';
        }
    
        return 'padding: 50px 136px';
    });

    return margen;
};

