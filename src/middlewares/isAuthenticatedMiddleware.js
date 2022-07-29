import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

async function isAuthenticatedMiddleware(req, res, next) {
  try {
    const token = req.header("Authorization");
    const secret = process.env.SECRET_TOKEN;
    if (!token)
      return res
        .status(401)
        .json({ message: "Você deveria estar logado para continuar" });

    const validToken = token.split(" ")[1];

    const data = jwt.verify(validToken, secret);
    res.locals = data.user;

    next();
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export default isAuthenticatedMiddleware;
