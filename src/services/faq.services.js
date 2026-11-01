import network from './network.services'

const listarFAQ = (params) => 
    network.get('/faq', { params });

const listarFAQPublicas = (params) => 
    network.get('/public/faq', { params });

const crearFAQ = (body) => 
    network.post('/faq', body);

const actualizarFAQ = (id, body) => 
    network.put(`/faq/${ id }`, body);

const eliminarFAQ = (id) =>
    network.delete(`/faq/${ id }`);

export default {
    listarFAQ,
    crearFAQ,
    actualizarFAQ,
    eliminarFAQ,
    listarFAQPublicas,
}