const Dokter = require("../models/dokter");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;
require("dotenv").config();

const login = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name dan password wajib diisi" });
  }

  try {
    const dokter = await Dokter.findOne({ where: { name } });
    if (!dokter) {
      return res.status(401).json({ error: "Dokter tidak ditemukan" });
    }

    const validPass = await bcrypt.compare(password, dokter.password);
    if (!validPass) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign(
      { id: dokter.id, name: dokter.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password)
      return res.status(400).json({ error: "Name dan password wajib diisi" });

    const existingDokter = await Dokter.findOne({ where: { name } });
    if (existingDokter)
      return res.status(400).json({ error: "Dokter sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newDokter = await Dokter.create({
      name,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Dokter berhasil didaftarkan",
      dokter: { id: newDokter.id, name: newDokter.name },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, register };
