const adminAuth = (req, res, next) => {
  console.log("✅ Admin auth is getting checked!!");

  const token = "xyz";

  // ✅ Token check logic
  const isAdminAuthorized = token === "xyz";

  // ❌ If unauthorized
  if (!isAdminAuthorized) {
    return res.status(401).send("❌ Unauthorized request");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
    console.log("✅ user auth is getting checked!!");
  
    const token = "xyz";
  
    // ✅ Token check logic
    const isAdminAuthorized = token === "xyz";
  
    // ❌ If unauthorized
    if (!isAdminAuthorized) {
      return res.status(401).send("❌ Unauthorized request");
    } else {
      next();
    }
  };
module.exports = { adminAuth,userAuth };
