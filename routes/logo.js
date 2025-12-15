const express = require('express');
const router = express.Router();
const Logo = require('../models/Logo');

router.get("/logos", async (req, res) => {
  try {
    const logos = await Logo.find({}, { _id: 0, imageurl: 1, companyname: 1 });

    res.status(200).json({
      success: true,
      data: logos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch asset images",
      error: error.message
    });
  }
});


// GET single logo by name
router.get("/logos/:companyname", async (req, res) => {
  try {
    const logo = await Logo.findOne(
      { companyname: req.params.companyname },
      { _id: 0, companyname: 1, imageurl: 1 }
    );

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Asset not found"
      });
    }

    res.status(200).json(logo);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching asset",
      error: error.message
    });
  }
});



// POST bulk create logos
router.post("/logos/bulk", async (req, res) => {
  try {
    const logos = req.body;

    // 1. Validate request body
    if (!Array.isArray(logos) || logos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array"
      });
    }

    // 2. Basic validation for each asset
    const formattedLogos = logos.map((logo, index) => {
      if (!logo.companyname || !logo.imageurl) {
        throw new Error(`Invalid logo at index ${index}`);
      }

      return {
        companyname: asset.companyname.trim(),
        imageurl: asset.imageurl.trim()
      };
    });

    // 3. Insert many (unordered = continues even if one fails)
    const result = await Logo.insertMany(formattedLogos, {
      ordered: false
    });

    res.status(201).json({
      success: true,
      message: "Assets inserted successfully",
      insertedCount: result.length,
      data: result.map(a => ({
        companyname: a.companyname,
        imageurl: a.imageurl
      }))
    });
  } catch (error) {
    // Duplicate key errors are expected sometimes
    if (error.code === 11000 || error.writeErrors) {
      return res.status(207).json({
        success: true,
        message: "Some assets were inserted, duplicates skipped",
        insertedCount: error.result?.nInserted || 0
      });
    }

    res.status(500).json({
      success: false,
      message: "Bulk insert failed",
      error: error.message
    });
  }
});


module.exports = router;
