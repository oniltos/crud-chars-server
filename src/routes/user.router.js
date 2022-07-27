import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import UserModel from "../models/user.js";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticatedMiddleware.js";

dotenv.config();
const userRouter = Router();

userRouter.post("/sign-up", async (req, res) => {
  try {
    const { email, password } = req.body;

    const salt = bcrypt.genSaltSync(+process.env.SALT);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const existeUser = await UserModel.findOne({ email });

    if (existeUser)
      return res
        .status(409)
        .json({ message: "Já existe um usuário com esse email" });

    const result = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso", result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existeUser = await UserModel.findOne({ email });

    if (!existeUser)
      return res.status(400).json({
        message: "Não existe nenhum usuário cadastrado com esse email!",
      });

    if (
      existeUser.email !== email ||
      !bcrypt.compareSync(password, existeUser.password)
    )
      return res
        .status(401)
        .json({ message: "Email ou senha não são compativeis" });

    const expiresIn = process.env.EXPIRE_IN;
    const secret = process.env.SECRET_TOKEN;

    const token = jwt.sign({ user: existeUser.id }, secret, {
      expiresIn: expiresIn,
    });

    return res.status(200).json({ message: "Auth OK", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

userRouter.get("/profile", isAuthenticatedMiddleware, async (_req, res) => {
  const id = res.locals;
  const user = await UserModel.findOne({ _id: id });
  res.status(200).json(user);
});

userRouter.put(
  "/change-profile",
  isAuthenticatedMiddleware,
  async (req, res) => {
    const id = res.locals;
    const editedUser = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: editedUser },
      {
        new: true,
      }
    );
    return res.status(200).json(user);
  }
);

export { userRouter };
