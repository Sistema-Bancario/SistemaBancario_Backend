const axios = require('axios');

const mostrarCambioDivisas = async (req, res) => {
    try {
        const apiKey = '6fe871b15ef3454ba9dda85922b49280';
        const url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
    
        const respuesta = await axios.get(url);
        const datos = respuesta.data;
    
        // Accede a las tasas de cambio
        const tasas = datos.rates;
        const valorDolarQuetzal = tasas.GTQ / tasas.USD;
        const valorEuroQuetzal = tasas.GTQ / tasas.EUR;
        const valorLibraQuetzal = tasas.GTQ / tasas.GBP;
    
        res.json({
          message: 'El cambio esta en',
          valores: {
            dolar: valorDolarQuetzal.toFixed(2),
            euro: valorEuroQuetzal.toFixed(2),
            libra: valorLibraQuetzal.toFixed(2)
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Error al obtener los valores de las monedas en quetzales'
        });
      }
};

module.exports = {
    mostrarCambioDivisas
};

