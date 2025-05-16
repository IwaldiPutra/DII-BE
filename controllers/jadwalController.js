const Dokter = require("../models/dokter");
const Jadwal = require("../models/jadwal");
const { Op } = require("sequelize");

const { getDatesByDay } = require("../utils/dateUtils");

const createJadwal = async (req, res) => {
  try {
    const {
      dokter_id,
      day,
      time_start,
      time_finish,
      quota,
      status,
      date_range,
    } = req.body;

    const dokter = await Dokter.findByPk(dokter_id);
    if (!dokter)
      return res.status(404).json({ error: "Dokter tidak ditemukan" });

    const [start, end] = date_range.split(" s/d ").map((s) => s.trim());
    if (!start || !end)
      return res.status(400).json({ error: "Format date_range salah" });

    const tanggalList = getDatesByDay(start, end, day);
    if (tanggalList.length === 0)
      return res.status(400).json({
        error: "Tidak ada hari sesuai dalam rentang tanggal",
      });

    if (time_start >= time_finish) {
      return res.status(400).json({
        error:
          "Jam mulai (time_start) harus lebih kecil dari jam selesai (time_finish)",
      });
    }

    const dibuat = [];
    const dilewati = [];

    for (const tanggal of tanggalList) {
      const tanggalStr = tanggal.toISOString().slice(0, 10);

      const existing = await Jadwal.findOne({
        where: {
          dokter_id,
          tanggal: tanggalStr,
          [Op.and]: [
            { time_start: { [Op.lt]: time_finish } },
            { time_finish: { [Op.gt]: time_start } },
          ],
        },
      });

      if (existing) {
        dilewati.push(tanggalStr + " " + time_start + "-" + time_finish);
        continue;
      }

      dibuat.push({
        dokter_id,
        day,
        time_start,
        time_finish,
        quota,
        status,
        tanggal: tanggalStr,
      });
    }

    if (dibuat.length > 0) {
      await Jadwal.bulkCreate(dibuat);
    }

    res.status(201).json({
      message:
        dibuat.length === 0 ? "Tidak ada data dibuat" : "Data berhasil dibuat",
      total_dibuat: dibuat.length,
      total_dilewati: dilewati.length,
      jadwal_dibuat: dibuat.map(
        (j) => j.tanggal + " " + j.time_start + "-" + j.time_finish,
      ),
      dilewati,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJadwal = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let whereCondition = {};

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: jadwalList } = await Jadwal.findAndCountAll({
      where: whereCondition,
      include: [{ model: Dokter, attributes: ["id", "name"] }],
      order: [
        ["tanggal", "ASC"],
        ["time_start", "ASC"],
      ],
      limit: limitNum,
      offset: offset,
    });

    if (jadwalList.length === 0) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });
    }

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      data: jadwalList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createJadwal, getJadwal };
