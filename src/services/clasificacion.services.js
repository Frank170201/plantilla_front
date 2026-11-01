import network from "./network.services";

const fetchTipoLocales = (params) => {
  return network.get("/clasificacion", { params });
};

const createTipoLocales = (params) => {
  return network.post("/clasificacion", params);
};

const updateTipoLocales = (id, params) => {
  return network.put(`/clasificacion/${id}`, params);
};

const deleteTipoLocales = (id) => {
  return network.delete(`/clasificacion/${id}`);
};

export default {
  fetchTipoLocales,
  createTipoLocales,
  updateTipoLocales,
  deleteTipoLocales,
};
