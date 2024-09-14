const { MercadoPagoConfig, Preference } = require('mercadopago');
const { getAuthUser } = require("../jwt");
const { Donation } = require("../db");


// Ad credentials
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });


  //generates a mercadopago payment link
  const createPaymentLink = async (req, res) => {
      try {
          const user = await getAuthUser(req)
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
                  metadata: {
                    id_user: user?.id
                  }
              }
            })
          res.status(200).json({paymentLink: paymentPreference.init_point});
      } catch (error) {
          res.status(401).json({ message: "No se pudo generar el link de pago" });
      }
  };



  //gets the donation list
const listDonation = async (req, res) => {
  try {
    const user = await getAuthUser(req)
    if(!user){return res.status(403).json({ error: "Authentication required" })}
    if(!user.isAdmin){return res.status(403).json({ error: "Only admins can perform this action" })}

    let query = req.query;
    let page;
    if(query.page) {
      page = query.page;
    } else {
      page = 1;
    }

    const itemsPerPage = 10
    page = parseInt(page);
    let donationCount = await Donation.findAndCountAll({
      limit: itemsPerPage,
      offset: itemsPerPage * (page-1)
    });

    res.status(200).json({
      page: page,
      totalPages: Math.ceil(donationCount / itemsPerPage),
      results: donationCount.rows
    });
  } catch (error) {
    res.status(500)
      .json({ message: "Error getting the user list", error: error.message });
  }
};



module.exports = {
    createPaymentLink,
    listDonation
};
