import jwt from 'jsonwebtoken'


export const userAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not authorized, login again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // Ensure req.body is initialized
      if (!req.body) req.body = {};

      req.body.userId = tokenDecode.id;
    } else {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    next();
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
