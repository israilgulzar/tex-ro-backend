const { makeRespObj } = require("../../AppUtils");
const OrderModel = require("../../models/orderModel/order");
const { constantHelpers, appMode } = require("../../helpers/constants");
const axios = require("axios");
const { spApiCall } = require("../../helpers/utils/utils");

const createOrder = async ({ question, ...restData }) => {
  try {
    await loginToShipRocket();
    return await getShippingCharges(constantHelpers.spToken);
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};


let email= "16mscit118@gmail.com"
let password="Utsav@123"
let token = ''; 

// ShipRocket base URLs
const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

// Login to ShipRocket API
const loginToShipRocket = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password
        });
        token = response.data.token;
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
    }
};

// Calculate shipping charges
const getShippingCharges = async (pickupPin, deliveryPin, weight) => {
  try {
      const params = {
        pickup_postcode: 365440,
        delivery_postcode: 400001,
        weight:2,
        cod: 0 // Set this to 1 if you are using COD (Cash on Delivery)
      };

      const response = await axios.get(`${BASE_URL}/courier/serviceability/`, {
          params,
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });
      
      // // Picking the cheapest courier service
      // const cheapestService = availableServices.reduce((min, service) => service.freight_charge < min.freight_charge ? service : min);
      // console.log('Cheapest shipping charge:', cheapestService.freight_charge);

      // console.log('Available courier services and shipping charges:', availableServices);

      const availableServices = response.data.data.available_courier_companies;

      const deliveryDetails = availableServices.map(courier => ({
        company: courier.courier_name,
        cost: courier.freight_charge,
        deliveryDate: courier.etd,
        deliveryTime: courier.cutoff_time,
      }));


      // Sort the array by cost in ascending order
      const sortedDeliveryDetails = deliveryDetails.sort((a, b) => a.cost - b.cost);

       return {
        status: true,
        status_code: 400,
        data: sortedDeliveryDetails,
      };
  } catch (error) {
      console.error('Error calculating shipping charges:', error.response ? error.response.data : error.message);
  }
};


// const getAuthToken = async () => {
//     try {
//       const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
//         email: "16mscit118@gmail.com",
//         password: "Utsav@123"
//       });
  
//       const token = response.data.token;
//       return token;
//     } catch (error) {
//       console.error('Error fetching token:', error.response ? error.response.data : error.message);
//     }
//   };

//   const getShippingCharges = async (token) => {

//     // const authToken = await getAuthToken();
//     // console.log('Token:', authToken);

//     const shippingResponse = await spApiCall({
//       path: "courier/serviceability",
//       body: {
//         pickup_postcode: 365440,
//         delivery_postcode: 400001,
//         cod:0,
//         weight:0.100,
//         width:2,
//         breadth:2,
//         height:2,
//       },
//     });

//     console.log(shippingResponse)
//     //const shippingDetails = {
//     //   pickup_postcode: '110001',  // Source PIN code
//     //   delivery_postcode: '400001', // Destination PIN code
//     //   cod: 0,  // 0 for prepaid, 1 for COD
//     //   weight: 1,  // Weight in kgs
//     //   length: 10,  // Length in cm
//     //   breadth: 10,  // Breadth in cm
//     //   height: 10,  // Height in cm
//     //   declared_value: 500  // Declared value of the package
//     // };
  
//     // const authToken = await getAuthToken();
//     // console.log('Token:', authToken);
//     // try {
//     //   const response = await axios.get(
//     //     'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
//     //     shippingDetails,
//     //     {
//     //       headers: {
//     //         'Authorization': `Bearer ${authToken}`,
//     //         'Content-Type': 'application/json'
//     //       }
//     //     }
//     //   );
      
//     //   console.log('Shipping Charges:', response.data);
//     // } catch (error) {
//     //   console.log(error.response)
//     //   console.error('Error fetching shipping charges:', error.response ? error.response.data : error.message);
//     // }
//   };


module.exports = {
    createOrder
};
  