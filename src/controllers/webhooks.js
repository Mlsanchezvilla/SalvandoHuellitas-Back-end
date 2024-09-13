
 //creates a new donation on DB
  const mercadopagoWebhook = (req, res) => {
    console.log(req.body);
     res.status(200).json();
  };



module.exports = {mercadopagoWebhook};