const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Penulis = db.Penulis;

// --- AUTHENTICATION ---
async function register(req, res) {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi."
      });
    }

    const existingPenulis = await Penulis.findOne({
      where: { email }
    });

    if (existingPenulis) {
      return res.status(400).json({
        message: "Email sudah terdaftar."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const penulis = await Penulis.create({
      nama,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Registrasi berhasil.",
      data: {
        id: penulis.id,
        nama: penulis.nama,
        email: penulis.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi."
      });
    }

    const penulis = await Penulis.findOne({
      where: { email }
    });

    if (!penulis) {
      return res.status(401).json({
        message: "Email atau password salah."
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      penulis.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Email atau password salah."
      });
    }

    const token = jwt.sign(
      {
        id: penulis.id,
        nama: penulis.nama,
        email: penulis.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES || "1d"
      }
    );

    return res.status(200).json({
      message: "Login berhasil.",
      token
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

// --- CRUD PENULIS ---
async function getAll(req, res) {
  try {
    const penulis = await Penulis.findAll({
      attributes: { exclude: ['password'] }
    });
    return res.status(200).json(penulis);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const { nama, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPenulis = await Penulis.create({
      nama,
      email,
      password: hashedPassword
    });
    return res.status(201).json({
      message: "Penulis berhasil ditambahkan.",
      data: { id: newPenulis.id, nama: newPenulis.nama, email: newPenulis.email }
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nama, email } = req.body;
    const penulis = await Penulis.findByPk(id);

    if (!penulis) {
      return res.status(404).json({ message: "Penulis tidak ditemukan." });
    }

    await penulis.update({ nama, email });
    return res.status(200).json({
      message: "Penulis berhasil diperbarui.",
      data: { id: penulis.id, nama: penulis.nama, email: penulis.email }
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const penulis = await Penulis.findByPk(id);

    if (!penulis) {
      return res.status(404).json({ message: "Penulis tidak ditemukan." });
    }

    await penulis.destroy();
    return res.status(200).json({ message: "Penulis berhasil dihapus." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
  getAll,
  create,
  update,
  remove
};