const { MercadoPagoConfig, Preference } = require('mercadopago');
const { getAuthUser } = require("../jwt");


// Ad credentials
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });


  //generates a mercadopago payment link
  const createPaymentLink = async (req, res) => {
      try {
          const preference = new Preference(client);
          const { amount } = req.body;
          if (!amount){return res.status(400).json({ message: "No se especifico la cantidad" });}
          const paymentPreference = await preference.create({
              body: {
                items: [
                  {
                    title: 'Donación',
                    quantity: 1,
                    unit_price: parseInt(amount)
                  }
                ],
              }
            })

          res.status(200).json({paymentLink: paymentPreference.init_point});
      } catch (error) {
          res.status(401).json({ message: "No se pudo generar el link de pago" });
      }
  };


  //creates a new donation on DB
  const createDonation = (req, res) => {};



module.exports = {
    createDonation,
    createPaymentLink
};
