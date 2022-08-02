import { Router } from "express";
import dotenv from "dotenv";
import CharModel from "../models/char.js";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticatedMiddleware.js";

dotenv.config();
const charRouter = Router();

charRouter.post("/characters", isAuthenticatedMiddleware, async (req, res) => {
  try {
    const id = res.locals;
    const { name } = req.body;

    const existeChar = await CharModel.findOne({
      $and: [{ name }, { _id: id }],
    });

    if (existeChar)
      return res
        .status(409)
        .json({ message: "Já existe um personagem com esse nome" });

    const result = await CharModel.create({
      ...req.body,
      userId: id,
    });
    return res
      .status(201)
      .json({ message: "Personagem criado com sucesso", result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

charRouter.get("/characters", isAuthenticatedMiddleware, async (_req, res) => {
  try {
    const id = res.locals;

    const chars = await CharModel.find({ userId: id });

    return res.status(200).json(chars);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

charRouter.get("/characters/:id", isAuthenticatedMiddleware, async (req, res) => {
  try {
    const char = await CharModel.findOne({ _id: req.params.id });

    if (!char)
      return res.status(404).json({ message: "Personagem não encontrado" });

    return res.status(200).json(char);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

charRouter.put("/characters/:id", isAuthenticatedMiddleware, async (req, res) => {
  try {
    const char = req.body;
    const { id } = req.params;
    const newChar = await CharModel.findOneAndUpdate({ _id: id }, char, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Personagem editado com sucesso", newChar });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

charRouter.delete("/characters/:id", isAuthenticatedMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChar = await CharModel.findOneAndDelete({ _id: id });

    if (!deletedChar)
      return res.status(404).json({ message: "Personagem não encontrado" });

    return res.status(204).json({ message: "Personagem deletado com sucesso" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

export { charRouter };
