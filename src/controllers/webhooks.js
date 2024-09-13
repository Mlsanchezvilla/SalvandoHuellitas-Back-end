const {MercadoPagoConfig, Payment, Preference} = require("mercadopago");
const { Donation } = require("../db");
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

 //creates a new donation on DB
  const mercadopagoWebhook = async (req, res) => {
    try {
        const pago_id = req.body.data.id;
        const payment = new Payment(client);

        let response = await payment.get({id: pago_id});
        const newDonation = await Donation.create({
            id_user: response.metadata?.id_user,
            amount: response.transaction_details.total_paid_amount,
            date: response.money_release_date,
        });
        res.status(200).json();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
  };

module.exports = {mercadopagoWebhook};