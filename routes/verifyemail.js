const transporter = require("../transpoter/transpoter")
const verifyEmail = async (email) => {
    try {
      await transporter.verify();
      return true;
    } catch (error) {
      return false;
    }
  };

  module.exports=verifyEmail;