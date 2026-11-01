import personasServices from "@/services/personas.services";
import { ref } from "vue";

const usePersona = () => {
  const personas = ref([]);
  const persona = ref(null);

  const listarPersonas = async () => {
    const { data } = await personasServices.fetchPersonas({
      pagination: false
    });

    personas.value = data?.rows;
  }

  const buscarPersonaPorDocumento = async (body) => {
    const { data } = await personasServices.buscarPersonaPorDoc(body);
    persona.value = data;
  }

  return {
    personas,
    persona,
    listarPersonas,
    buscarPersonaPorDocumento,
  }
}

export default usePersona
